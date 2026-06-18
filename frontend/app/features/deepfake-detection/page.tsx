import type { Metadata } from 'next';
import DeepfakeDetectionClient from './DeepfakeDetectionClient';
import './deepfake.css';

export const metadata: Metadata = {
  title: 'Deepfake Detection – TrustShield AI',
  description: 'Detect deepfakes in any image or video, frame by frame, with authenticity scoring, Grad-CAM heatmaps, and an explainable AI report.',
};

export default function DeepfakeDetectionPage() {
  return <DeepfakeDetectionClient />;
}
