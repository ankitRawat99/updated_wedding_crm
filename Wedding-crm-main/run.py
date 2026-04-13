import uvicorn

if __name__ == "__main__":
    print("Starting Wedding CRM Server...")
    print("Server will be available at: http://127.0.0.1:7500")
    print("Press Ctrl+C to stop the server")
    uvicorn.run(
        "app.main:app", 
        host="127.0.0.1", 
        port=7500, 
        reload=True,
        access_log=False,
        use_colors=False
    )