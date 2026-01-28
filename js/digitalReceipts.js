// Digital Receipts Manager for Viksit Vaani – SwarVyapaar
// Handles receipt generation, storage, sharing, and multilingual support

class DigitalReceiptsManager {
    constructor() {
        this.receipts = [];
        this.currentLanguage = 'english';
        this.isInitialized = false;
        
        // Receipt templates for different languages
        this.receiptTemplates = {
            english: {
                title: 'Digital Receipt',
                labels: {
                    receiptId: 'Receipt ID',
                    date: 'Date',
                    time: 'Time',
                    location: 'Location',
                    vendor: 'Vendor',
                    buyer: 'Buyer',
                    items: 'Items',
                    quantity: 'Quantity',
                    unitPrice: 'Unit Price',
                    amount: 'Amount',
                    subtotal: 'Subtotal',
                    tax: 'Tax',
                    total: 'Total',
                    paymentMethod: 'Payment Method',
                    status: 'Status',
                    madeForBharat: 'Made for Bharat',
                    swarVyapaar: 'SwarVyapaar',
                    thankYou: 'Thank you for using SwarVyapaar!'
                }
            },
            hindi: {
                title: 'डिजिटल रसीद',
                labels: {
                    receiptId: 'रसीद आईडी',
                    date: 'दिनांक',
                    time: 'समय',
                    location: 'स्थान',
                    vendor: 'विक्रेता',
                    buyer: 'खरीदार',
                    items: 'वस्तुएं',
                    quantity: 'मात्रा',
                    unitPrice: 'इकाई मूल्य',
                    amount: 'राशि',
                    subtotal: 'उप-योग',
                    tax: 'कर',
                    total: 'कुल',
                    paymentMethod: 'भुगतान विधि',
                    status: 'स्थिति',
                    madeForBharat: 'भारत के लिए बनाया गया',
                    swarVyapaar: 'स्वरव्यापार',
                    thankYou: 'स्वरव्यापार का उपयोग करने के लिए धन्यवाद!'
                }
            },
            telugu: {
                title: 'డిజిటల్ రసీదు',
                labels: {
                    receiptId: 'రసీదు ID',
                    date: 'తేదీ',
                    time: 'సమయం',
                    location: 'స్థానం',
                    vendor: 'విక్రేత',
                    buyer: 'కొనుగోలుదారు',
                    items: 'వస్తువులు',
                    quantity: 'పరిమాణం',
                    unitPrice: 'యూనిట్ ధర',
                    amount: 'మొత్తం',
                    subtotal: 'ఉప మొత్తం',
                    tax: 'పన్ను',
                    total: 'మొత్తం',
                    paymentMethod: 'చెల్లింపు పద్ధతి',
                    status: 'స్థితి',
                    madeForBharat: 'భారత్ కోసం తయారు చేయబడింది',
                    swarVyapaar: 'స్వరవ్యాపార్',
                    thankYou: 'స్వరవ్యాపార్ ఉపయోగించినందుకు ధన్యవాదాలు!'
                }
            }
            // Add more languages as needed
        };
    }
    
    // Initialize the receipts manager
    init() {
        if (this.isInitialized) return;
        
        try {
            // Load existing receipts from localStorage
            this.loadReceipts();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI
            this.initializeUI();
            
            this.isInitialized = true;
            console.log('📄 Digital Receipts Manager initialized');
            
        } catch (error) {
            console.error('Failed to initialize Digital Receipts Manager:', error);
        }
    }
    
    // Load receipts from localStorage
    loadReceipts() {
        const stored = localStorage.getItem('swar-vyapaar-receipts');
        if (stored) {
            this.receipts = JSON.parse(stored);
        }
    }
    
    // Save receipts to localStorage
    saveReceipts() {
        localStorage.setItem('swar-vyapaar-receipts', JSON.stringify(this.receipts));
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Listen for successful payments
        window.addEventListener('paymentSuccess', (event) => {
            this.generateReceipt(event.detail);
        });
        
        // Listen for language changes
        window.addEventListener('languageChanged', (event) => {
            this.currentLanguage = event.detail.language;
            this.refreshReceiptsDisplay();
        });
        
        // Tab switching
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-tab]')) {
                this.switchTab(event.target.getAttribute('data-tab'));
            }
        });
    }
    
    // Initialize UI components
    initializeUI() {
        this.refreshReceiptsDisplay();
        this.updateReceiptsStats();
    }
    
    // Generate a new digital receipt
    generateReceipt(transactionData) {
        const receipt = {
            id: this.generateReceiptId(),
            transactionId: transactionData.transactionId,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN'),
            location: transactionData.location || 'Local Mandi',
            vendor: transactionData.vendor || 'Local Vendor',
            buyer: transactionData.buyer || 'Customer',
            items: transactionData.items || [],
            subtotal: transactionData.subtotal || 0,
            tax: transactionData.tax || 0,
            total: transactionData.total || 0,
            paymentMethod: transactionData.paymentMethod || 'Cash',
            status: 'Completed',
            language: this.currentLanguage,
            shared: false,
            downloaded: false
        };
        
        // Add to receipts array
        this.receipts.unshift(receipt);
        
        // Save to localStorage
        this.saveReceipts();
        
        // Show receipt immediately
        this.showReceiptModal(receipt);
        
        // Update UI
        this.refreshReceiptsDisplay();
        this.updateReceiptsStats();
        
        // Trigger success event
        this.triggerReceiptGenerated(receipt);
        
        return receipt;
    }
    
    // Generate unique receipt ID
    generateReceiptId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `SV${timestamp}${random}`;
    }
    
    // Show receipt in modal
    showReceiptModal(receipt) {
        const modal = document.getElementById('receiptModal');
        const content = document.getElementById('receiptContent');
        
        if (!modal || !content) return;
        
        const template = this.receiptTemplates[receipt.language] || this.receiptTemplates.english;
        
        content.innerHTML = this.generateReceiptHTML(receipt, template);
        modal.style.display = 'flex';
        
        // Setup modal close handlers
        this.setupModalHandlers(modal, receipt);
    }
    
    // Generate receipt HTML
    generateReceiptHTML(receipt, template) {
        return `
            <div class="receipt-container">
                <!-- Receipt Header -->
                <div class="receipt-header">
                    <div class="receipt-logo">
                        <span class="receipt-flag">🇮🇳</span>
                        <h2>${template.labels.swarVyapaar}</h2>
                    </div>
                    <div class="receipt-id">
                        <strong>${template.labels.receiptId}:</strong> ${receipt.id}
                    </div>
                </div>
                
                <!-- Receipt Info -->
                <div class="receipt-info">
                    <div class="info-row">
                        <div class="info-item">
                            <strong>${template.labels.date}:</strong> ${receipt.date}
                        </div>
                        <div class="info-item">
                            <strong>${template.labels.time}:</strong> ${receipt.time}
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item">
                            <strong>${template.labels.location}:</strong> ${receipt.location}
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-item">
                            <strong>${template.labels.vendor}:</strong> ${receipt.vendor}
                        </div>
                        <div class="info-item">
                            <strong>${template.labels.buyer}:</strong> ${receipt.buyer}
                        </div>
                    </div>
                </div>
                
                <!-- Items -->
                <div class="receipt-items">
                    <h3>${template.labels.items}</h3>
                    <div class="items-table">
                        <div class="items-header">
                            <span>Product</span>
                            <span>${template.labels.quantity}</span>
                            <span>${template.labels.unitPrice}</span>
                            <span>${template.labels.amount}</span>
                        </div>
                        ${receipt.items.map(item => `
                            <div class="items-row">
                                <span>${item.product}</span>
                                <span>${item.quantity}</span>
                                <span>₹${item.unitPrice}</span>
                                <span>₹${item.amount}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Totals -->
                <div class="receipt-totals">
                    <div class="total-row">
                        <span>${template.labels.subtotal}:</span>
                        <span>₹${receipt.subtotal}</span>
                    </div>
                    <div class="total-row">
                        <span>${template.labels.tax}:</span>
                        <span>₹${receipt.tax}</span>
                    </div>
                    <div class="total-row total-final">
                        <span>${template.labels.total}:</span>
                        <span>₹${receipt.total}</span>
                    </div>
                </div>
                
                <!-- Payment Info -->
                <div class="receipt-payment">
                    <div class="payment-row">
                        <span>${template.labels.paymentMethod}:</span>
                        <span>${receipt.paymentMethod}</span>
                    </div>
                    <div class="payment-row">
                        <span>${template.labels.status}:</span>
                        <span class="status-completed">${receipt.status}</span>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="receipt-footer">
                    <div class="footer-branding">
                        <p>${template.labels.madeForBharat}</p>
                        <p>${template.labels.thankYou}</p>
                    </div>
                    <div class="footer-watermark">
                        <div class="tricolor-line"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Setup modal handlers
    setupModalHandlers(modal, receipt) {
        const closeBtn = modal.querySelector('.modal-close');
        const downloadBtn = document.getElementById('downloadReceipt');
        const shareBtn = document.getElementById('shareReceipt');
        
        // Close handlers
        const closeModal = () => {
            modal.style.display = 'none';
        };
        
        if (closeBtn) {
            closeBtn.onclick = closeModal;
        }
        
        // Download handler
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                this.downloadReceipt(receipt);
            };
        }
        
        // Share handler
        if (shareBtn) {
            shareBtn.onclick = () => {
                this.shareReceipt(receipt);
            };
        }
        
        // Close on backdrop click
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
            }
        };
    }
    
    // Download receipt as PDF
    downloadReceipt(receipt) {
        // Mark as downloaded
        receipt.downloaded = true;
        this.saveReceipts();
        
        // Create downloadable content
        const content = this.generateReceiptText(receipt);
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${receipt.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Receipt downloaded successfully!', 'success');
        this.updateReceiptsStats();
    }
    
    // Share receipt
    shareReceipt(receipt) {
        const content = this.generateReceiptText(receipt);
        
        if (navigator.share) {
            // Use native sharing if available
            navigator.share({
                title: 'Digital Receipt - SwarVyapaar',
                text: content
            }).then(() => {
                receipt.shared = true;
                this.saveReceipts();
                this.updateReceiptsStats();
                this.showNotification('Receipt shared successfully!', 'success');
            }).catch(console.error);
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(content).then(() => {
                receipt.shared = true;
                this.saveReceipts();
                this.updateReceiptsStats();
                this.showNotification('Receipt copied to clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Failed to copy receipt', 'error');
            });
        }
    }
    
    // Generate receipt as text
    generateReceiptText(receipt) {
        const template = this.receiptTemplates[receipt.language] || this.receiptTemplates.english;
        
        return `
🇮🇳 ${template.labels.swarVyapaar} - ${template.title}
${template.labels.receiptId}: ${receipt.id}

${template.labels.date}: ${receipt.date}
${template.labels.time}: ${receipt.time}
${template.labels.location}: ${receipt.location}

${template.labels.vendor}: ${receipt.vendor}
${template.labels.buyer}: ${receipt.buyer}

${template.labels.items}:
${receipt.items.map(item => 
    `${item.product} - ${item.quantity} @ ₹${item.unitPrice} = ₹${item.amount}`
).join('\n')}

${template.labels.subtotal}: ₹${receipt.subtotal}
${template.labels.tax}: ₹${receipt.tax}
${template.labels.total}: ₹${receipt.total}

${template.labels.paymentMethod}: ${receipt.paymentMethod}
${template.labels.status}: ${receipt.status}

${template.labels.madeForBharat}
${template.labels.thankYou}
        `.trim();
    }
    
    // Switch between tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        // Load tab-specific data
        if (tabName === 'receipts') {
            this.refreshReceiptsDisplay();
        }
    }
    
    // Refresh receipts display
    refreshReceiptsDisplay() {
        const receiptsGrid = document.getElementById('receiptsGrid');
        if (!receiptsGrid) return;
        
        if (this.receipts.length === 0) {
            receiptsGrid.innerHTML = `
                <div class="no-receipts">
                    <div class="no-receipts-icon">🧾</div>
                    <h3>No Digital Receipts Yet</h3>
                    <p>Complete a transaction to generate your first digital receipt!</p>
                </div>
            `;
            return;
        }
        
        receiptsGrid.innerHTML = this.receipts.map(receipt => `
            <div class="receipt-card" onclick="DigitalReceiptsManager.instance.showReceiptModal(${JSON.stringify(receipt).replace(/"/g, '&quot;')})">
                <div class="receipt-card-header">
                    <div class="receipt-card-id">${receipt.id}</div>
                    <div class="receipt-card-date">${receipt.date}</div>
                </div>
                <div class="receipt-card-content">
                    <div class="receipt-card-vendor">${receipt.vendor}</div>
                    <div class="receipt-card-total">₹${receipt.total}</div>
                </div>
                <div class="receipt-card-footer">
                    <div class="receipt-card-location">📍 ${receipt.location}</div>
                    <div class="receipt-card-actions">
                        ${receipt.downloaded ? '<span class="action-badge downloaded">📥</span>' : ''}
                        ${receipt.shared ? '<span class="action-badge shared">📤</span>' : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update receipts statistics
    updateReceiptsStats() {
        const totalReceipts = document.getElementById('totalReceipts');
        const digitalReceipts = document.getElementById('digitalReceipts');
        const sharedReceipts = document.getElementById('sharedReceipts');
        const downloadedReceipts = document.getElementById('downloadedReceipts');
        
        const total = this.receipts.length;
        const shared = this.receipts.filter(r => r.shared).length;
        const downloaded = this.receipts.filter(r => r.downloaded).length;
        
        if (totalReceipts) totalReceipts.textContent = total;
        if (digitalReceipts) digitalReceipts.textContent = total;
        if (sharedReceipts) sharedReceipts.textContent = shared;
        if (downloadedReceipts) downloadedReceipts.textContent = downloaded;
    }
    
    // Trigger receipt generated event
    triggerReceiptGenerated(receipt) {
        window.dispatchEvent(new CustomEvent('receiptGenerated', {
            detail: { receipt }
        }));
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Simulate payment success for testing
    simulatePayment(testData = null) {
        const mockTransaction = testData || {
            transactionId: 'TXN' + Date.now(),
            location: 'Chandragiri Mandi, Andhra Pradesh',
            vendor: 'Ravi Kumar',
            buyer: 'Local Customer',
            items: [
                { product: 'Potato', quantity: '5 kg', unitPrice: 25, amount: 125 },
                { product: 'Onion', quantity: '3 kg', unitPrice: 35, amount: 105 }
            ],
            subtotal: 230,
            tax: 23,
            total: 253,
            paymentMethod: 'UPI'
        };
        
        this.generateReceipt(mockTransaction);
    }
}

// Create global instance
DigitalReceiptsManager.instance = new DigitalReceiptsManager();

// Export for global use
window.DigitalReceiptsManager = DigitalReceiptsManager;