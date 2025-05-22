import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mainImage, setMainImage] = useState('/images/main.jpg');
  const [thumbnails, setThumbnails] = useState([
    '/images/thumb1.jpg',
    '/images/thumb2.jpg',
    '/images/thumb3.jpg',
    '/images/main.jpg',
  ]);
  const [title, setTitle] = useState('Tenis Niko');
  const [price, setPrice] = useState('R$ 69,99');
  const [sizes, setSizes] = useState(['36', '37', '38', '39', '40', '41', '42', '43', '44']);
  const [availableSizes, setAvailableSizes] = useState(['37', '40', '41', '42']);
  const [colors, setColors] = useState(['Vermelho', 'Azul', 'Preto']);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState(4.2);
  const [reviewCount, setReviewCount] = useState(349);
  const [originalPrice, setOriginalPrice] = useState('R$ 99,99');
  const [discount, setDiscount] = useState('37% off');
  const [installmentPrice, setInstallmentPrice] = useState('R$ 89,99');
  const [installmentCount, setInstallmentCount] = useState(5);

  useEffect(() => {
    const savedState = localStorage.getItem('productState');
    if (savedState) {
      const state = JSON.parse(savedState);
      setMainImage(state.mainImage);
      setSelectedSize(state.selectedSize);
      setSelectedColor(state.selectedColor);
      setCep(state.cep);
      setAddress(state.address);
    }
  }, []);

  useEffect(() => {
    const state = {
      mainImage,
      selectedSize,
      selectedColor,
      cep,
      address,
    };
    localStorage.setItem('productState', JSON.stringify(state));
    const timer = setTimeout(() => {
      localStorage.removeItem('productState');
    }, 15 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [mainImage, selectedSize, selectedColor, cep, address]);

  const handleThumbnailClick = (thumbnail) => {
    setMainImage(thumbnail);
  };

  const handleCepChange = (e) => {
    const value = e.target.value;
    setCep(value);
    if (value.length === 8) {
      fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            setAddress(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
          } else {
            setAddress('CEP não encontrado');
          }
        })
        .catch(error => {
          console.error('Erro ao buscar CEP:', error);
          setAddress('Erro ao buscar CEP');
        });
    }
  };

  return (
    <div className="container">
      <div className="product-grid">
        <div className="image-section">
          <img src={mainImage} alt="Produto" className="product-image" />
          <div className="thumbnails-container">
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${mainImage === thumbnail ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(thumbnail)}
              />
            ))}
          </div>
        </div>
        <div className="info-section">
          <h1 className="product-title">{title}</h1>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
            ))}
            <span>{rating}</span>
            <span className="text-gray-600">({reviewCount} avaliações)</span>
          </div>
          <div className="price-container">
            <p className="price-pix">{price} no Pix</p>
            <p className="original-price">{originalPrice}</p>
            <p className="discount">{discount}</p>
            <p className="installment">ou {installmentPrice} em até {installmentCount}x sem juros</p>
          </div>
          <div className="sizes-section">
            <h2 className="sizes-title">Selecione um tamanho</h2>
            <div className="sizes-grid">
              {sizes.map((size) => (
                <label
                  key={size}
                  className={`size-option ${!availableSizes.includes(size) ? 'disabled' : ''} ${selectedSize === size ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={selectedSize === size}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="hidden"
                    disabled={!availableSizes.includes(size)}
                  />
                  {!availableSizes.includes(size) ? (
                    <div className="relative">
                      <span className="absolute inset-0 flex items-center justify-center text-gray-500" title="Indisponível">{size}</span>
                    </div>
                  ) : (
                    size
                  )}
                </label>
              ))}
            </div>
          </div>
          <div className="colors-section">
            <h2 className="colors-title">Cor</h2>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="color-select"
            >
              <option value="">Selecione uma cor</option>
              {colors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div className="cep-section">
            <h2 className="cep-title">CEP</h2>
            <input
              type="text"
              value={cep}
              onChange={handleCepChange}
              placeholder="Digite o CEP"
              className="cep-input"
            />
            {address && <p className="cep-address">{address}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
