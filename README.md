# ポーカーウェブアプリケーション

## 機能

- プレイヤーとディーラーの対戦形式
- カード配布アニメーション
- クリックでカードをホールド
- カード配置（ランダムな位置と角度）
- ディーラーカードのめくりアニメーション
- 基本的なポーカーの役判定

## 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)
- anime.js - アニメーションライブラリ
- http-server - ローカル開発サーバー

## セットアップ方法

1. 依存関係をインストールします：

```
npm install
```

2. ローカルサーバーを起動します：

```
npm start
```

3. ブラウザで http://localhost:8080 にアクセスしてゲームを開始します。

## ゲームの遊び方

1. 「配る」ボタンをクリックしてゲームを開始します。
2. プレイヤーとディーラーにそれぞれ5枚のカードが配られます（ディーラーのカードは裏向き）。
3. 交換したくないカードをクリックしてホールドします（選択したカードには「HOLD」ラベルが表示されます）。
4. 「ドロー」ボタンをクリックして、ホールドしていないカードを交換します。
5. 結果が表示され、プレイヤーとディーラーの手札が比較されます。
6. 「新しいゲーム」ボタンをクリックして次のゲームを開始します。

## アニメーション効果

- カードがテーブルサイドから一枚ずつ配られるアニメーション
- カードごとにわずかに異なる位置と角度で配置される
- ディーラーカードが裏向きから表向きにめくられる
- 勝利時の視覚的なフィードバック

## ライセンス

MIT
