import React from 'react';
import './App.css';

function App(): React.JSX.Element {
  return (
    <div className="bg-blue-100 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          ECサイト
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl text-gray-800 mb-4">自己紹介</h2>
          <p className="text-gray-600 leading-relaxed">
            こんにちは！私はプログラミングを勉強中の学生です。
            Tailwind CSSを使ってこのページを作りました。
            まだまだ勉強中ですが、少しずつ上達していきたいと思います。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-2">商品カード</h3>
            <p className="text-blue-500">
              この商品の詳細はありません。
            </p>
          </div>
          
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">tailwind css</h3>
            <p className="text-yellow-700">
              これはテストです。
            </p>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            お問い合わせ
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
