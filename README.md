# NASCare

NASCare is a full-stack application designed to classify medical images using a machine learning model. It consists of a React-based frontend and a FastAPI backend that serves a PyTorch model.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.8+
- Node.js and npm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Zrini2005/NASCare.git
    cd NASCare
    ```

2.  **Setup the Backend (`nas_api`)**

    Navigate to the backend directory and install the required Python packages.

    ```bash
    cd nas_api
    pip install -r requirements.txt
    cd ..
    ```

3.  **Setup the Frontend (`react-nas-ui`)**

    Navigate to the frontend directory and install the required Node.js packages.

    ```bash
    cd react-nas-ui
    npm install
    cd ..
    ```

## Usage

To run the application, you need to start both the backend and the frontend servers.

1.  **Start the Backend Server**

    In a terminal, navigate to the `nas_api` directory and run the following command:

    ```bash
    cd nas_api
    uvicorn app.main:app --reload
    ```

    The API server will be running on `http://127.0.0.1:8000`.

2.  **Start the Frontend Development Server**
   
    Add .env file and fill the Gemini API Key,
    In a separate terminal, navigate to the `react-nas-ui` directory and run the following command:

    ```bash
    cd react-nas-ui
    npm start
    ```

    The React application will open in your browser at `http://localhost:3000`.

    You can now upload an image through the web interface to get a prediction from the model.

## Technologies Used

### Backend

- [FastAPI](https://fastapi.tiangolo.com/) - The web framework for building APIs.
- [PyTorch](https://pytorch.org/) - The machine learning framework used for the model.
- [Uvicorn](https://www.uvicorn.org/) - The ASGI server.
- [Pillow](https://python-pillow.org/) - For image manipulation.

### Frontend

- [React](https://reactjs.org/) - The web framework used for the user interface.
- [Tailwind CSS](https://tailwindcss.com/) - For styling. 
