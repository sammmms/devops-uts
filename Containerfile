# Use Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy dependencies first (better for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your app code
COPY . .

# Expose port (adjust if your app runs elsewhere)
EXPOSE 5000

# Command to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]