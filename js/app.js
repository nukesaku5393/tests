// ポーカーゲームのメインアプリケーション
document.addEventListener('DOMContentLoaded', () => {
    // DOM要素
    const dealerCardsEl = document.getElementById('dealer-cards');
    const playerCardsEl = document.getElementById('player-cards');
    const dealBtn = document.getElementById('deal-btn');
    const drawBtn = document.getElementById('draw-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const messageEl = document.getElementById('message');
    const resultEl = document.getElementById('result');

    // ゲーム状態
    let deck = [];
    let playerCards = [];
    let dealerCards = [];
    let heldCards = []; // ホールドされたカードのインデックスを保持
    let isDealing = false; // カード配布中フラグ

    // カードの初期化
    const initializeDeck = () => {
        const suits = ['heart', 'diamond', 'club', 'spade'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];

        for (const suit of suits) {
            for (const value of values) {
                deck.push({ suit, value });
            }
        }

        // デッキをシャッフル
        shuffleDeck();
    };

    // デッキのシャッフル
    const shuffleDeck = () => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    };

    // カードを描画
    const renderCard = (card, container, isDealer = false, index = 0) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        if (isDealer) {
            cardElement.classList.add('card-back');
        } else {
            cardElement.classList.add(card.suit);
            
            const valueElement = document.createElement('div');
            valueElement.classList.add('card-value');
            valueElement.textContent = card.value;
            
            const suitElement = document.createElement('div');
            suitElement.classList.add('card-suit');
            
            // スートの絵文字を設定
            switch (card.suit) {
                case 'heart':
                    suitElement.textContent = '♥';
                    break;
                case 'diamond':
                    suitElement.textContent = '♦';
                    break;
                case 'club':
                    suitElement.textContent = '♣';
                    break;
                case 'spade':
                    suitElement.textContent = '💩';
                    break;
            }
            
            cardElement.appendChild(valueElement);
            cardElement.appendChild(suitElement);
            
            // プレイヤーのカードの場合、ホールド可能にする
            if (container === playerCardsEl) {
                cardElement.dataset.index = index;
                cardElement.addEventListener('click', () => {
                    toggleHoldCard(cardElement, index);
                });
                
                // 既にホールドされているカードの場合、ホールド表示を追加
                if (heldCards.includes(index)) {
                    cardElement.classList.add('held');
                    
                    // ホールドされたカードに「HOLD」表示を追加
                    const holdLabel = document.createElement('div');
                    holdLabel.classList.add('hold-label');
                    holdLabel.textContent = 'HOLD';
                    cardElement.appendChild(holdLabel);
                }
            }
        }
        
        container.appendChild(cardElement);
        
        return cardElement;
    };

    // カードのホールド状態を切り替え
    const toggleHoldCard = (cardElement, index) => {
        if (!drawBtn.disabled && !isDealing) {
            if (heldCards.includes(index)) {
                // ホールド解除
                heldCards = heldCards.filter(i => i !== index);
                cardElement.classList.remove('held');
                
                // HOLDラベルを削除
                const holdLabel = cardElement.querySelector('.hold-label');
                if (holdLabel) {
                    cardElement.removeChild(holdLabel);
                }
            } else {
                // ホールド設定
                heldCards.push(index);
                cardElement.classList.add('held');
                
                // HOLDラベルを追加
                const holdLabel = document.createElement('div');
                holdLabel.classList.add('hold-label');
                holdLabel.textContent = 'HOLD';
                cardElement.appendChild(holdLabel);
            }
        }
    };

    // ランダムな位置のオフセットを生成
    const getRandomOffset = () => {
        return {
            x: Math.random() * 20 - 10, // -10px から 10px
            y: Math.random() * 20 - 10, // -10px から 10px
            rotate: Math.random() * 6 - 3 // -3度 から 3度
        };
    };

    // カードを一枚ずつ配る
    const dealCardWithAnimation = (card, container, isDealer, index, totalCards, callback) => {
        const cardElement = renderCard(card, container, isDealer, index);
        const containerWidth = container.offsetWidth;
        const cardWidth = 100; // カードの幅
        
        // カードの配置位置を計算（均等に分布させつつランダム性を持たせる）
        const basePosition = (containerWidth - cardWidth) / 2 - ((totalCards - 1) * 120 / 2) + (index * 120);
        const offset = getRandomOffset();
        
        // カードの初期位置と最終位置を設定
        anime.set(cardElement, {
            left: -150,
            top: '50%',
            translateY: '-50%',
            rotate: 0,
            opacity: 0
        });
        
        // カードを配るアニメーション
        anime({
            targets: cardElement,
            left: basePosition + offset.x,
            top: `calc(50% + ${offset.y}px)`,
            translateY: '-50%',
            rotate: offset.rotate,
            opacity: 1,
            easing: 'easeOutQuint',
            duration: 600,
            delay: index * 300,
            complete: function() {
                if (index === totalCards - 1 && callback) {
                    callback();
                }
            }
        });
        
        return cardElement;
    };

    // カードを配る
    const dealCards = () => {
        if (isDealing) return;
        
        isDealing = true;
        initializeDeck();
        playerCards = [];
        dealerCards = [];
        heldCards = []; // ホールドされたカードをリセット
        
        // UI要素をクリア
        dealerCardsEl.innerHTML = '';
        playerCardsEl.innerHTML = '';
        resultEl.textContent = '';
        
        // カードデッキの要素を追加
        const dealerDeck = document.createElement('div');
        dealerDeck.classList.add('card-deck', 'dealer-deck');
        dealerCardsEl.appendChild(dealerDeck);
        
        const playerDeck = document.createElement('div');
        playerDeck.classList.add('card-deck', 'player-deck');
        playerCardsEl.appendChild(playerDeck);
        
        // ボタンの状態を更新
        dealBtn.disabled = true;
        drawBtn.disabled = true;
        newGameBtn.disabled = true;
        
        messageEl.textContent = 'カードを配っています...';
        
        // カードを5枚ずつ用意
        for (let i = 0; i < 5; i++) {
            playerCards.push(deck.pop());
            dealerCards.push(deck.pop());
        }
        
        // プレイヤーのカードを一枚ずつ配る
        setTimeout(() => {
            let dealedCount = 0;
            
            // ディーラーのカードを配る
            for (let i = 0; i < dealerCards.length; i++) {
                dealCardWithAnimation(dealerCards[i], dealerCardsEl, true, i, dealerCards.length, () => {
                    // ディーラーのカードが全て配られたら、プレイヤーのカードを配る
                    setTimeout(() => {
                        for (let j = 0; j < playerCards.length; j++) {
                            dealCardWithAnimation(playerCards[j], playerCardsEl, false, j, playerCards.length, () => {
                                // 全てのカードが配られたら、ゲームを開始
                                isDealing = false;
                                drawBtn.disabled = false;
                                newGameBtn.disabled = false;
                                messageEl.textContent = 'ホールドするカードをクリックして選択してください。「ドロー」ボタンを押すとホールドしていないカードが交換されます。';
                            });
                        }
                    }, 500);
                });
            }
        }, 500);
    };

    // 手札の評価
    const evaluateHand = (cards) => {
        // 役の判定ロジックを実装
        // 簡略化のため、基本的な役のみ実装
        
        // カードの値を数値に変換
        const values = cards.map(card => {
            if (card.value === 'A') return 14;
            if (card.value === 'K') return 13;
            if (card.value === 'Q') return 12;
            if (card.value === 'J') return 11;
            return parseInt(card.value);
        }).sort((a, b) => a - b);
        
        const suits = cards.map(card => card.suit);
        
        // フラッシュ判定
        const isFlush = suits.every(suit => suit === suits[0]);
        
        // ストレート判定
        let isStraight = true;
        for (let i = 1; i < values.length; i++) {
            if (values[i] !== values[i-1] + 1) {
                isStraight = false;
                break;
            }
        }
        
        // ロイヤルストレートフラッシュ
        if (isFlush && isStraight && values[0] === 10) {
            return { rank: 9, name: 'ロイヤルストレートフラッシュ' };
        }
        
        // ストレートフラッシュ
        if (isFlush && isStraight) {
            return { rank: 8, name: 'ストレートフラッシュ' };
        }
        
        // 値の出現回数をカウント
        const valueCounts = {};
        values.forEach(value => {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
        });
        
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        
        // フォーカード
        if (counts[0] === 4) {
            return { rank: 7, name: 'フォーカード' };
        }
        
        // フルハウス
        if (counts[0] === 3 && counts[1] === 2) {
            return { rank: 6, name: 'フルハウス' };
        }
        
        // フラッシュ
        if (isFlush) {
            return { rank: 5, name: 'フラッシュ' };
        }
        
        // ストレート
        if (isStraight) {
            return { rank: 4, name: 'ストレート' };
        }
        
        // スリーカード
        if (counts[0] === 3) {
            return { rank: 3, name: 'スリーカード' };
        }
        
        // ツーペア
        if (counts[0] === 2 && counts[1] === 2) {
            return { rank: 2, name: 'ツーペア' };
        }
        
        // ワンペア
        if (counts[0] === 2) {
            return { rank: 1, name: 'ワンペア' };
        }
        
        // ハイカード
        return { rank: 0, name: 'ハイカード' };
    };

    // カードを交換
    const drawNewCards = () => {
        if (isDealing) return;
        
        isDealing = true;
        // 交換するカードの情報を保持
        const cardsToReplace = [];
        
        // ホールドされていないカードを特定し、新しいカードを用意
        for (let i = 0; i < playerCards.length; i++) {
            if (!heldCards.includes(i)) {
                const newCard = deck.pop();
                cardsToReplace.push({
                    index: i,
                    card: newCard
                });
                playerCards[i] = newCard;
            }
        }
        
        // 既存のカード要素を取得
        const existingCardElements = playerCardsEl.querySelectorAll('.card');
        
        // 交換するカードだけを置き換え（一枚ずつアニメーション）
        let replacedCount = 0;
        
        const replaceNextCard = () => {
            if (replacedCount >= cardsToReplace.length) {
                // 全てのカードが交換されたら結果を表示
                isDealing = false;
                showResult();
                return;
            }
            
            const { index, card } = cardsToReplace[replacedCount];
            
            // 古いカード要素を削除
            if (existingCardElements[index]) {
                playerCardsEl.removeChild(existingCardElements[index]);
            }
            
            // 新しいカードをアニメーションで配る
            const containerWidth = playerCardsEl.offsetWidth;
            const cardWidth = 100;
            const basePosition = (containerWidth - cardWidth) / 2 - ((playerCards.length - 1) * 120 / 2) + (index * 120);
            const offset = getRandomOffset();
            
            const newCardElement = renderCard(card, playerCardsEl, false, index);
            
            // 初期位置を設定
            anime.set(newCardElement, {
                left: -150,
                top: '50%',
                translateY: '-50%',
                rotate: 0,
                opacity: 0
            });
            
            // カードを配るアニメーション
            anime({
                targets: newCardElement,
                left: basePosition + offset.x,
                top: `calc(50% + ${offset.y}px)`,
                translateY: '-50%',
                rotate: offset.rotate,
                opacity: 1,
                easing: 'easeOutQuint',
                duration: 600,
                complete: function() {
                    replacedCount++;
                    setTimeout(replaceNextCard, 200);
                }
            });
        };
        
        // 最初のカードの交換を開始
        if (cardsToReplace.length > 0) {
            replaceNextCard();
        } else {
            // 交換するカードがない場合は結果を表示
            isDealing = false;
            showResult();
        }
    };

    // 結果表示
    const showResult = () => {
        // ディーラーのカードを表示（裏向きから表向きにアニメーション）
        const dealerCardElements = dealerCardsEl.querySelectorAll('.card');
        
        dealerCardElements.forEach((cardElement, index) => {
            // 裏向きのカードを削除
            dealerCardsEl.removeChild(cardElement);
            
            // 表向きのカードを作成
            const containerWidth = dealerCardsEl.offsetWidth;
            const cardWidth = 100;
            const basePosition = (containerWidth - cardWidth) / 2 - ((dealerCards.length - 1) * 120 / 2) + (index * 120);
            const offset = getRandomOffset();
            
            const newCardElement = renderCard(dealerCards[index], dealerCardsEl, false, index);
            
            // カードの位置を設定
            anime.set(newCardElement, {
                left: basePosition + offset.x,
                top: `calc(50% + ${offset.y}px)`,
                translateY: '-50%',
                rotate: offset.rotate,
                opacity: 0,
                scale: 0.8
            });
            
            // カードをめくるアニメーション
            anime({
                targets: newCardElement,
                opacity: 1,
                scale: 1,
                rotateY: ['90deg', '0deg'],
                easing: 'easeOutQuad',
                duration: 400,
                delay: index * 200
            });
        });
        
        // 少し遅延して結果を表示
        setTimeout(() => {
            // 手札を評価
            const playerHandResult = evaluateHand(playerCards);
            const dealerHandResult = evaluateHand(dealerCards);
            
            // 結果メッセージを表示
            messageEl.textContent = `プレイヤー: ${playerHandResult.name} vs ディーラー: ${dealerHandResult.name}`;
            
            if (playerHandResult.rank > dealerHandResult.rank) {
                resultEl.textContent = 'プレイヤーの勝ち！';
                
                // 勝利アニメーション
                anime({
                    targets: resultEl,
                    scale: [1, 1.2, 1],
                    color: ['#e94560', '#ffcc00', '#e94560'],
                    duration: 1500,
                    easing: 'easeInOutQuad'
                });
            } else if (playerHandResult.rank < dealerHandResult.rank) {
                resultEl.textContent = 'ディーラーの勝ち！';
            } else {
                resultEl.textContent = '引き分け！';
            }
            
            // ボタンの状態を更新
            drawBtn.disabled = true;
            dealBtn.disabled = true;
            newGameBtn.disabled = false;
        }, dealerCards.length * 200 + 500);
    };

    // 新しいゲームを開始
    const startNewGame = () => {
        dealBtn.disabled = false;
        drawBtn.disabled = true;
        newGameBtn.disabled = true;
        
        dealerCardsEl.innerHTML = '';
        playerCardsEl.innerHTML = '';
        resultEl.textContent = '';
        messageEl.textContent = 'ゲームを開始するには「配る」ボタンをクリックしてください';
    };

    // イベントリスナー
    dealBtn.addEventListener('click', dealCards);
    drawBtn.addEventListener('click', drawNewCards);
    newGameBtn.addEventListener('click', startNewGame);

    // 初期状態
    startNewGame();
});
