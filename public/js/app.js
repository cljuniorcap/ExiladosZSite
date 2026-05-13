// Estado global do usuário
let currentSteamID = null;

// Lista de itens disponíveis na loja
const storeItems = [
    { 
        id: 'wpn_m4a1', 
        name: 'M4A1 Assault Rifle', 
        price: 'R$ 25,00', 
        image: '/img/m4a1_rifle.png',
        tag: 'Arma'
    },
    { 
        id: 'gear_plate', 
        name: 'Plate Carrier Tático', 
        price: 'R$ 15,00', 
        image: '/img/plate_carrier.png',
        tag: 'Equipamento'
    },
    { 
        id: 'veh_mh6', 
        name: 'MH-6 Little Bird', 
        price: 'R$ 80,00', 
        image: '/img/little_bird.png',
        tag: 'Veículo'
    },
    { 
        id: 'ammo_556', 
        name: 'Caixa Munição 5.56', 
        price: 'R$ 5,00', 
        image: '/img/ammo_box.png',
        tag: 'Suprimento'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    checkUserLogin();
    renderStoreItems();
});

// Busca os dados do usuário via API que configuramos no server.js
async function checkUserLogin() {
    try {
        const response = await fetch('/api/user');
        const userData = await response.json();
        
        const userSection = document.getElementById('user-section');
        
        if (userData.loggedIn) {
            currentSteamID = userData.steamid;
            
            // Atualiza a UI para mostrar perfil do usuário
            userSection.innerHTML = `
                <div class="flex items-center gap-4 bg-card px-4 py-2 rounded-xl border border-gray-800 shadow-md fade-in">
                    <div class="text-right hidden sm:block">
                        <div class="text-sm font-bold text-white leading-tight">${userData.personaname}</div>
                        <div class="text-xs text-primary font-mono mt-0.5">ID: ${userData.steamid}</div>
                    </div>
                    <img src="${userData.avatar}" alt="Avatar" class="w-11 h-11 rounded-lg border border-gray-600 shadow-sm">
                    <div class="w-px h-8 bg-gray-700 mx-2"></div>
                    <a href="/logout" class="text-gray-400 hover:text-primary transition-colors flex items-center justify-center p-2 rounded-lg hover:bg-gray-800" title="Sair da Conta">
                        <i class="fas fa-sign-out-alt text-xl"></i>
                    </a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Falha ao checar status de login:', error);
    }
}

// Renderiza os cards de itens dinamicamente
function renderStoreItems() {
    const grid = document.getElementById('items-grid');
    grid.innerHTML = '';

    storeItems.forEach((item, index) => {
        const card = document.createElement('div');
        // Adiciona delay na animação em cascata
        card.className = `glass-card rounded-2xl overflow-hidden item-card flex flex-col fade-in`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="relative h-56 bg-[#0c0c0e] overflow-hidden flex items-center justify-center group p-4 border-b border-gray-800">
                <span class="absolute top-3 left-3 bg-dark/80 text-gray-300 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm border border-gray-700 z-10">${item.tag}</span>
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain drop-shadow-2xl">
                <!-- Overlay de gradiente -->
                <div class="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent opacity-60"></div>
            </div>
            <div class="p-6 flex flex-col flex-grow relative">
                <h3 class="text-xl font-bold text-gray-100 mb-1 tracking-tight">${item.name}</h3>
                <div class="text-primary font-black text-2xl mb-6 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]">${item.price}</div>
                
                <button onclick="simulatePurchase('${item.id}')" class="mt-auto w-full bg-primary hover:bg-red-500 active:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] border border-red-400/30">
                    <i class="fas fa-cart-plus"></i> Adquirir Item
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Função simuladora de compra exigida no requisito
function simulatePurchase(itemId) {
    if (!currentSteamID) {
        alert("🔒 Autenticação Necessária:\\nPor favor, faça login com sua conta Steam antes de realizar compras.");
        return;
    }

    const item = storeItems.find(i => i.id === itemId);
    
    const consoleMsg = `
=================================
[EXILADOSZ] TENTATIVA DE COMPRA
=================================
Usuário SteamID : ${currentSteamID}
Item Selecionado: ${item.name} (ID: ${itemId})
Valor           : ${item.price}
Status          : Processamento Simulado com Sucesso
=================================`;
    
    console.log(consoleMsg);
    
    alert(`✅ Compra Registrada no Sistema!\\n\\nItem: ${item.name}\\nSteamID do Comprador: ${currentSteamID}\\n\\nVerifique o console (F12) para os logs de integração.`);
}
