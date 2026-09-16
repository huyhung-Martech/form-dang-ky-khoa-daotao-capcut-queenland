import os
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer, SquareModuleDrawer
from PIL import Image, ImageDraw, ImageFont

project_dir = r"h:\test antigravity\tiktok-training-app"
artifact_dir = r"C:\Users\ADMIN\.gemini\antigravity-ide\brain\bcaf1c11-a025-4c40-b93a-6f5bf2dfdf93"
url = "https://daotaoqueenland.vercel.app/"
logo_path = os.path.join(project_dir, "assets", "logo-queenland.png")

# --- 1. Generate Standard High-Res Crisp QR Code (1000x1000) ---
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=25,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Generate with sharp dark navy/black on white
img_clean = qr.make_image(fill_color="#0b192c", back_color="#ffffff").convert("RGBA")

clean_path = os.path.join(project_dir, "qr-daotao-queenland.png")
clean_asset_path = os.path.join(project_dir, "assets", "qr-daotao-queenland.png")
clean_artifact_path = os.path.join(artifact_dir, "qr-daotao-queenland.png")

img_clean.save(clean_path, dpi=(300, 300))
img_clean.save(clean_asset_path, dpi=(300, 300))
img_clean.save(clean_artifact_path, dpi=(300, 300))
print(f"Clean QR saved to {clean_path}, size: {img_clean.size}")

# --- 2. Generate QR Code with Center Queen Land Logo ---
# Logo size should be ~22% of QR code width to ensure 100% readability with ERROR_CORRECT_H (30% capacity)
qr_w, qr_h = img_clean.size
if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    
    # Target logo box size
    box_size = int(qr_w * 0.26)
    
    # Create white badge background with rounded corners for logo
    badge = Image.new("RGBA", (box_size, box_size), (0, 0, 0, 0))
    badge_draw = ImageDraw.Draw(badge)
    # Rounded rectangle white background
    corner_rad = 20
    badge_draw.rounded_rectangle([0, 0, box_size, box_size], radius=corner_rad, fill=(255, 255, 255, 255), outline=(220, 226, 235, 255), width=3)
    
    # Resize logo to fit inside badge with padding
    pad = 16
    logo_max_w = box_size - pad * 2
    logo_max_h = box_size - pad * 2
    logo_aspect = logo.width / logo.height
    
    if logo_aspect > 1:
        new_w = logo_max_w
        new_h = int(new_w / logo_aspect)
    else:
        new_h = logo_max_h
        new_w = int(new_h * logo_aspect)
        
    logo_resized = logo.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste logo in center of badge
    badge.paste(logo_resized, (pad + (logo_max_w - new_w) // 2, pad + (logo_max_h - new_h) // 2), mask=logo_resized.split()[3])
    
    # Paste badge onto center of QR
    img_logo_qr = img_clean.copy()
    center_pos = ((qr_w - box_size) // 2, (qr_h - box_size) // 2)
    img_logo_qr.paste(badge, center_pos, mask=badge.split()[3])
    
    logo_qr_path = os.path.join(project_dir, "qr-daotao-queenland-logo.png")
    logo_qr_asset_path = os.path.join(project_dir, "assets", "qr-daotao-queenland-logo.png")
    logo_qr_artifact_path = os.path.join(artifact_dir, "qr-daotao-queenland-logo.png")
    
    img_logo_qr.save(logo_qr_path, dpi=(300, 300))
    img_logo_qr.save(logo_qr_asset_path, dpi=(300, 300))
    img_logo_qr.save(logo_qr_artifact_path, dpi=(300, 300))
    print(f"Logo QR saved to {logo_qr_path}")

# --- 3. Generate Ready-to-Print / Share Standee Card (1200 x 1600 px) ---
card_w, card_h = 1200, 1600
card = Image.new("RGB", (card_w, card_h), "#0B192C")
draw = ImageDraw.Draw(card)

# Draw subtle gradient or decorative elements
# Top banner / accents
draw.rectangle([0, 0, card_w, 12], fill="#FF0050") # TikTok red line
draw.rectangle([0, 12, card_w, 20], fill="#00F2FE") # TikTok cyan line

# Draw central white card container
card_pad_x = 80
card_pad_top = 80
card_pad_bot = 80
draw.rounded_rectangle([card_pad_x, card_pad_top, card_w - card_pad_x, card_h - card_pad_bot], radius=36, fill="#FFFFFF")

# Add Queen Land Logo at top of white container
if os.path.exists(logo_path):
    header_logo = Image.open(logo_path).convert("RGBA")
    h_logo_w = 280
    h_logo_h = int(h_logo_w / (header_logo.width / header_logo.height))
    header_logo_resized = header_logo.resize((h_logo_w, h_logo_h), Image.Resampling.LANCZOS)
    card.paste(header_logo_resized, ((card_w - h_logo_w) // 2, card_pad_top + 40), mask=header_logo_resized.split()[3])

# Load fonts
try:
    font_title = ImageFont.truetype("arialbd.ttf", 46)
    font_sub = ImageFont.truetype("arial.ttf", 30)
    font_badge = ImageFont.truetype("arialbd.ttf", 26)
    font_url = ImageFont.truetype("arialbd.ttf", 34)
    font_note = ImageFont.truetype("arial.ttf", 24)
except:
    font_title = font_sub = font_badge = font_url = font_note = ImageFont.load_default()

# Title text
title_y = card_pad_top + 160
text_title = "KHÓA ĐÀO TẠO TIKTOK BĐS 2026"
bbox_title = draw.textbbox((0, 0), text_title, font=font_title)
tw = bbox_title[2] - bbox_title[0]
draw.text(((card_w - tw) // 2, title_y), text_title, fill="#0B192C", font=font_title)

# Subtitle
sub_y = title_y + 65
text_sub = "Quét mã để Đăng Ký Học & Nhận Tài Liệu"
bbox_sub = draw.textbbox((0, 0), text_sub, font=font_sub)
sw = bbox_sub[2] - bbox_sub[0]
draw.text(((card_w - sw) // 2, sub_y), text_sub, fill="#4A5568", font=font_sub)

# Schedule Pill / Badge
pill_y = sub_y + 55
text_pill = "THỜI GIAN: 09:00 - 11:00  |  2 BUỔI THỰC CHIẾN"
bbox_pill = draw.textbbox((0, 0), text_pill, font=font_badge)
pw = bbox_pill[2] - bbox_pill[0]
pill_bg_w = pw + 60
pill_bg_h = 44
pill_x = (card_w - pill_bg_w) // 2
draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_bg_w, pill_y + pill_bg_h], radius=22, fill="#F0F4F8")
draw.text((pill_x + 30, pill_y + 8), text_pill, fill="#0052CC", font=font_badge)

# QR Code in card
qr_display_size = 560
img_qr_resized = img_logo_qr.resize((qr_display_size, qr_display_size), Image.Resampling.LANCZOS)
qr_box_y = pill_y + 80
# Frame for QR code
draw.rounded_rectangle([((card_w - qr_display_size) // 2) - 15, qr_box_y - 15, ((card_w + qr_display_size) // 2) + 15, qr_box_y + qr_display_size + 15], radius=24, outline="#E2E8F0", width=3)
card.paste(img_qr_resized, ((card_w - qr_display_size) // 2, qr_box_y))

# Direct URL Link Box
url_y = qr_box_y + qr_display_size + 40
url_box_w = 700
url_box_h = 60
url_box_x = (card_w - url_box_w) // 2
draw.rounded_rectangle([url_box_x, url_y, url_box_x + url_box_w, url_y + url_box_h], radius=16, fill="#FFF5F5", outline="#FEB2B2", width=2)

text_url = "daotaoqueenland.vercel.app"
bbox_u = draw.textbbox((0, 0), text_url, font=font_url)
uw = bbox_u[2] - bbox_u[0]
draw.text(((card_w - uw) // 2, url_y + 12), text_url, fill="#E53E3E", font=font_url)

# Bottom note
note_y = url_y + 80
text_note = "Mở Zalo hoặc Camera điện thoại để quét mã QR"
bbox_n = draw.textbbox((0, 0), text_note, font=font_note)
nw = bbox_n[2] - bbox_n[0]
draw.text(((card_w - nw) // 2, note_y), text_note, fill="#718096", font=font_note)

# Save Card
card_path = os.path.join(project_dir, "qr-daotao-queenland-standee.png")
card_asset_path = os.path.join(project_dir, "assets", "qr-daotao-queenland-standee.png")
card_artifact_path = os.path.join(artifact_dir, "qr-daotao-queenland-standee.png")

card.save(card_path, dpi=(300, 300))
card.save(card_asset_path, dpi=(300, 300))
card.save(card_artifact_path, dpi=(300, 300))
print(f"Standee Card saved to {card_path}")

# --- 4. Export Vector SVG for Printing ---
import qrcode.image.svg
qr_svg = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
    image_factory=qrcode.image.svg.SvgPathImage
)
qr_svg.add_data(url)
qr_svg.make(fit=True)
svg_img = qr_svg.make_image()
svg_img.save(os.path.join(project_dir, "qr-daotao-queenland.svg"))
svg_img.save(os.path.join(project_dir, "assets", "qr-daotao-queenland.svg"))
print("SVG vector saved successfully")
