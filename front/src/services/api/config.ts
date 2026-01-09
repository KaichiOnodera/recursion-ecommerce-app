// 環境変数からAPIベースURLを取得（本番環境では相対パスを使用）
// ローカル開発環境では http://localhost:8000 を使用
// 検証、本番環境では /api を使用（ALBが /api/* をAPIサーバーにルーティング）
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
