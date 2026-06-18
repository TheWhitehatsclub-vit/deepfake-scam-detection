import torch
import torch.nn.functional as F
import numpy as np
from PIL import Image
import io
import os
import cv2
from datetime import datetime
from services.deepfake_model import model, processor
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure heatmap directory exists
HEATMAP_DIR = "uploads/heatmaps"
os.makedirs(HEATMAP_DIR, exist_ok=True)


def generate_gradcam(image: Image.Image, target_class: int = None) -> dict:
    """
    Generate Grad-CAM heatmap for the given image.
    
    Args:
        image: PIL Image in RGB format
        target_class: Target class index for Grad-CAM. If None, uses predicted class.
    
    Returns:
        dict with heatmap_url and heatmap_generated status
    """
    try:
        logger.info("Starting Grad-CAM generation")
        
        # Process image
        inputs = processor(images=image, return_tensors="pt")
        pixel_values = inputs["pixel_values"]
        
        # Enable gradient computation
        pixel_values.requires_grad = True
        
        # Forward pass
        outputs = model(pixel_values)
        logits = outputs.logits
        
        # Get predicted class if target_class not provided
        if target_class is None:
            target_class = logits.argmax(dim=1).item()
        
        logger.info(f"Target class for Grad-CAM: {target_class}")
        
        # Get gradients for target class
        model.zero_grad()
        logits[0, target_class].backward(retain_graph=True)
        
        # Get gradients from input
        gradients = pixel_values.grad
        
        # Get the last convolutional layer features
        # For transformers models, we need to access the appropriate layer
        # This implementation uses a gradient-based approach on the input
        
        # Pool gradients to get importance weights
        pooled_gradients = torch.mean(gradients, dim=[0, 2, 3])
        
        # Get the activations (we'll use the input as a proxy for this simple implementation)
        # For a more sophisticated implementation, you'd hook into intermediate layers
        activations = pixel_values.detach()
        
        # Weight the activations by the pooled gradients
        for i in range(activations.shape[1]):
            activations[:, i, :, :] *= pooled_gradients[i]
        
        # Generate heatmap by averaging across channels
        heatmap = torch.mean(activations, dim=1).squeeze()
        heatmap = F.relu(heatmap)
        
        # Normalize heatmap
        heatmap = heatmap / (heatmap.max() + 1e-8)
        heatmap = heatmap.cpu().numpy()
        
        # Resize heatmap to match original image size
        original_size = image.size
        heatmap = cv2.resize(heatmap, (original_size[0], original_size[1]))
        
        # Convert to uint8
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        # Convert BGR to RGB
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
        
        # Overlay heatmap on original image
        original_np = np.array(image)
        overlay = cv2.addWeighted(original_np, 0.6, heatmap, 0.4, 0)
        
        # Convert back to PIL Image
        overlay_image = Image.fromarray(overlay)
        
        # Save heatmap
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"heatmap_{timestamp}.png"
        filepath = os.path.join(HEATMAP_DIR, filename)
        overlay_image.save(filepath)
        
        logger.info(f"Grad-CAM heatmap saved to: {filepath}")
        
        # Return the URL (relative path)
        heatmap_url = f"/heatmaps/{filename}"
        
        return {
            "heatmap_url": heatmap_url,
            "heatmap_generated": True
        }
        
    except Exception as e:
        logger.error(f"Grad-CAM generation failed: {str(e)}", exc_info=True)
        return {
            "heatmap_generated": False,
            "error": str(e)
        }


def generate_gradcam_advanced(image: Image.Image, target_class: int = None) -> dict:
    """
    Advanced Grad-CAM implementation using intermediate layer hooks.
    This provides better visualization by accessing actual convolutional features.
    
    Args:
        image: PIL Image in RGB format
        target_class: Target class index for Grad-CAM. If None, uses predicted class.
    
    Returns:
        dict with heatmap_url and heatmap_generated status
    """
    try:
        logger.info("Starting advanced Grad-CAM generation")
        
        # Process image
        inputs = processor(images=image, return_tensors="pt")
        pixel_values = inputs["pixel_values"]
        
        # Store activations and gradients
        activations = {}
        gradients = {}
        
        def forward_hook(module, input, output):
            activations['value'] = output
        
        def backward_hook(module, grad_input, grad_output):
            gradients['value'] = grad_output[0]
        
        # Try to register hooks on the last convolutional layer
        # This depends on the model architecture
        target_layer = None
        
        # For ViT models, try to get the last encoder layer
        if hasattr(model, 'vit') and hasattr(model.vit, 'encoder'):
            target_layer = model.vit.encoder.layer[-1]
        elif hasattr(model, 'encoder'):
            if hasattr(model.encoder, 'layer'):
                target_layer = model.encoder.layer[-1]
            elif hasattr(model.encoder, 'layers'):
                target_layer = model.encoder.layers[-1]
        # For CNN models, try to get the last conv layer
        elif hasattr(model, 'convnext'):
            target_layer = model.convnext.features[-1]
        elif hasattr(model, 'resnet'):
            target_layer = model.resnet.layer4[-1]
        
        if target_layer is None:
            logger.warning("Could not find suitable target layer, falling back to input-based Grad-CAM")
            return generate_gradcam(image, target_class)
        
        # Register hooks
        forward_handle = target_layer.register_forward_hook(forward_hook)
        backward_handle = target_layer.register_full_backward_hook(backward_hook)
        
        try:
            # Forward pass
            outputs = model(pixel_values)
            logits = outputs.logits
            
            # Get predicted class if target_class not provided
            if target_class is None:
                target_class = logits.argmax(dim=1).item()
            
            logger.info(f"Target class for advanced Grad-CAM: {target_class}")
            
            # Backward pass
            model.zero_grad()
            logits[0, target_class].backward(retain_graph=True)
            
            # Get activations and gradients
            if 'value' not in activations or 'value' not in gradients:
                logger.warning("Could not capture activations/gradients, falling back to input-based Grad-CAM")
                return generate_gradcam(image, target_class)
            
            act = activations['value']
            grad = gradients['value']
            
            # Pool gradients
            pooled_grad = torch.mean(grad, dim=[0, 2, 3])
            
            # Weight activations
            for i in range(act.shape[1]):
                act[:, i, :, :] *= pooled_grad[i]
            
            # Generate heatmap
            heatmap = torch.mean(act, dim=1).squeeze()
            heatmap = F.relu(heatmap)
            
            # Normalize
            heatmap = heatmap / (heatmap.max() + 1e-8)
            heatmap = heatmap.cpu().numpy()
            
            # Resize to original image size
            original_size = image.size
            heatmap = cv2.resize(heatmap, (original_size[0], original_size[1]))
            
            # Convert to uint8 and apply colormap
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
            
            # Overlay on original image
            original_np = np.array(image)
            overlay = cv2.addWeighted(original_np, 0.6, heatmap, 0.4, 0)
            
            # Save
            overlay_image = Image.fromarray(overlay)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"heatmap_advanced_{timestamp}.png"
            filepath = os.path.join(HEATMAP_DIR, filename)
            overlay_image.save(filepath)
            
            logger.info(f"Advanced Grad-CAM heatmap saved to: {filepath}")
            
            heatmap_url = f"/heatmaps/{filename}"
            
            return {
                "heatmap_url": heatmap_url,
                "heatmap_generated": True
            }
            
        finally:
            # Remove hooks
            forward_handle.remove()
            backward_handle.remove()
            
    except Exception as e:
        logger.error(f"Advanced Grad-CAM generation failed: {str(e)}", exc_info=True)
        logger.info("Falling back to basic Grad-CAM")
        return generate_gradcam(image, target_class)
