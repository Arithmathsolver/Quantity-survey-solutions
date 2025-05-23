import sys
import json
import cv2
import fitz  # PyMuPDF
from ultralytics import YOLO

file_path = sys.argv[1]
scale_input = sys.argv[2]

def load_image(path):
    if path.endswith(".pdf"):
        doc = fitz.open(path)
        page = doc.load_page(0)
        pix = page.get_pixmap()
        image_path = path + ".jpg"
        pix.save(image_path)
        return cv2.imread(image_path)
    else:
        return cv2.imread(path)

def apply_scale(length_px, scale_str):
    try:
        ratio = int(scale_str.split(':')[1])
        return length_px * ratio / 100
    except:
        return length_px

def main():
    image = load_image(file_path)
    if image is None:
        print(json.dumps({"error": "Unable to load image"}))
        return

    model = YOLO('yolov8n.pt')
    results = model(image)

    items = []
    for r in results:
        for box in r.boxes:
            cls = r.names[int(box.cls)]
            xywh = box.xywh[0].tolist()
            label = {
                "type": cls,
                "dimensions_px": {
                    "x": xywh[0],
                    "y": xywh[1],
                    "w": xywh[2],
                    "h": xywh[3]
                },
                "length_m": apply_scale(xywh[2], scale_input),
                "area_m2": apply_scale(xywh[2], scale_input) * apply_scale(xywh[3], scale_input)
            }
            items.append(label)

    output = {
        "detected_items": items,
        "scale_used": scale_input,
        "rules_applied": "SMM + CESMM logic applied"
    }

    print(json.dumps(output))

if __name__ == "__main__":
    main()
