import React, { useState, useEffect } from 'react';

export const OrderComplete: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">注文完了</h1>
        <p className="text-lg text-gray-700 mb-4">
          ご注文ありがとうございます！
        </p>
        <p className="text-gray-600">
          注文が正常に完了しました。確認のメールをお送りしましたので、ご確認ください。
        </p>
      </div>
    </div>
  );
};
