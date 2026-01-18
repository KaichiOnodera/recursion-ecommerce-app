import React, { useState } from 'react';
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ShareWishlistButtonProps {
  wishlistId: number;
  wishlistName: string | null;
  isPublic: boolean;
}

export const ShareWishlistButton: React.FC<ShareWishlistButtonProps> = ({
  wishlistId,
  wishlistName,
  isPublic,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!isPublic) {
      alert(
        '公開ウィッシュリストのみ共有できます。ウィッシュリストを公開に設定してください。',
      );
      return;
    }

    const shareUrl = `${window.location.origin}/wishlist/${wishlistId}`;

    try {
      // クリップボードにコピー
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // フォールバック: テキストエリアを使用
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        alert(
          'URLのコピーに失敗しました。手動でコピーしてください: ' + shareUrl,
        );
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isPublic
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
      }`}
      disabled={!isPublic}
      title={
        isPublic
          ? 'ウィッシュリストのURLをコピー'
          : '公開ウィッシュリストのみ共有できます'
      }
    >
      {copied ? (
        <>
          <CheckIcon className="w-5 h-5" />
          <span className="text-sm font-medium">コピーしました</span>
        </>
      ) : (
        <>
          <ShareIcon className="w-5 h-5" />
          <span className="text-sm font-medium">共有</span>
        </>
      )}
    </button>
  );
};
