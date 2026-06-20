import ssl, socket
from datetime import datetime, timezone

def check_ssl(domain: str) -> dict:
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=domain) as s:
            s.settimeout(5)
            s.connect((domain, 443))
            cert = s.getpeercert()

        # expiry check
        expires_str = cert.get("notAfter", "")
        expires = datetime.strptime(expires_str, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
        days_left = (expires - datetime.now(timezone.utc)).days

        issuer = dict(x[0] for x in cert.get("issuer", []))
        org = issuer.get("organizationName", "Unknown")

        if days_left < 0:
            return {"score": 90, "status": "danger", "details": "SSL certificate has EXPIRED.", "issuer": org, "days_remaining": days_left}
        elif days_left < 30:
            return {"score": 60, "status": "warning", "details": f"SSL expires in {days_left} days.", "issuer": org, "days_remaining": days_left}
        else:
            return {"score": 5, "status": "safe", "details": f"Valid SSL. Issued by {org}. {days_left} days remaining.", "issuer": org, "days_remaining": days_left}

    except ssl.SSLError:
        return {"score": 85, "status": "danger", "details": "SSL certificate is invalid or self-signed.", "issuer": None, "days_remaining": None}
    except (socket.timeout, ConnectionRefusedError):
        return {"score": 70, "status": "danger", "details": "Site does not support HTTPS or connection timed out.", "issuer": None, "days_remaining": None}
    except Exception as e:
        return {"score": 40, "status": "warning", "details": f"SSL check failed: {str(e)}", "issuer": None, "days_remaining": None}