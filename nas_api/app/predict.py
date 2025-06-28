# app/predict.py
import torch
from torchvision import transforms
from PIL import Image
from app.model import NASModel, best_architecture

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = NASModel(best_architecture, num_classes=4).to(device)
model.load_state_dict(torch.load("model/the_nas_model.pth", map_location=device))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),     
    transforms.ToTensor()
])

label_map = {
    0: "glioma_tumor",
    1: "meningioma_tumor",
    2: "no_tumor",
    3: "pituitary_tumor"
}

def predict_image(image: Image.Image) -> str:
    image = image.convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(tensor)
        predicted_class = output.argmax(dim=1).item()
    return label_map[predicted_class]
