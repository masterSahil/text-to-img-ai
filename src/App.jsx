import { useState } from 'react';
import './App.css';
import loader from './assets/img/loading.gif';
import defaultImg from './assets/img/image-gallery.png'

function App() {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false); 
  const [defaultImage, setDefaultImage] = useState(true);

  // api
  const KEY = "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"; 

  async function query(data) {
    setLoading(true); 
    setDefaultImage(false);
    try {
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/ZB-Tech/Text-to-Image",
        {
          headers: {
            Authorization: `Bearer ${KEY}`,
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({ inputs: data }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false); 
    }
  }

  const generate = async () => {
    if (!input.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    const response = await query(input);
    if (response) {
      const imageUrl = URL.createObjectURL(response);
      setUrl(imageUrl);
    }
  };

  function handleSubmit(e)
  {
    if (e.key === "Enter") {
      e.preventDefault();
      generate();
    }
  }
  function handleReset()
  {
    window.location.reload();
  }
  
  function download() {
    if (!url) {
      alert("No image to download!");
      return;
    }
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
    <h1 className='heading'>AI Text to Image Generator</h1>
    <div className="container">
      <div className="input-box">
        <input
          type="text" className='input'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSubmit}
          placeholder="Enter prompt..."
        />
        <button onClick={generate} disabled={loading} className='btn'>
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>

      <div className="img-box">
        <div className="img-container">
            {url && !loading && <img src={url} alt="Generated" />}
            {defaultImage && <img src={defaultImg} alt="img" className="defualtImg" />}
            {loading && <img className='loader' src={loader} alt="loader" /> }
        </div>
        <div className="btns-container">
          <button className="download" onClick={download}>Download</button>
          <button className="reset" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
