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
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img src={mainImage} alt="Produto" className="w-full h-auto" />
          <div className="flex flex-wrap mt-2">
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover cursor-pointer m-1"
                onClick={() => handleThumbnailClick(thumbnail)}
              />
            ))}
          </div>
        </div>
        <div className="md:w-2/3 md:pl-4 lg:pl-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-yellow-500 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
            ))}
            <span className="ml-1">{rating}</span>
            <span className="ml-2 text-gray-600">({reviewCount} avaliações)</span>
          </div>
          <p className="text-xl text-green-600">{price} no Pix</p>
          <p className="text-lg text-gray-500 line-through">{originalPrice}</p>
          <p className="text-lg text-red-600">{discount}</p>
          <p className="text-lg">ou {installmentPrice} em até {installmentCount}x sem juros</p>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Selecione um tamanho</h2>
            <div className="flex flex-wrap mt-2">
              {sizes.map((size) => (
                <span key={size} className="m-1">
                  <label className={`flex items-center justify-center w-10 h-10 border border-gray-300 rounded cursor-pointer ${!availableSizes.includes(size) ? 'bg-gray-200' : ''} ${selectedSize === size ? 'border-red-500' : ''}`}>
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
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              <b>Acerte o tamanho:</b> Para mais conforto, recomendamos escolher um <b>tamanho maior</b> que o usual. <button className="text-blue-500 underline">Saiba mais.</button>
            </p>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Cor</h2>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione uma cor</option>
              {colors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">CEP</h2>
            <input
              type="text"
              value={cep}
              onChange={handleCepChange}
              placeholder="Digite o CEP"
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
            {address && <p className="mt-2">{address}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
