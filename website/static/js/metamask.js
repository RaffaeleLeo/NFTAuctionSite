//METAMASK
window.userWalletAddress = null
const connectWallet = document.getElementById('connectWallet')
const walletAddress = document.getElementById('walletAddress')
const walletBalance = document.getElementById('walletBalance')


function errorMetamask(){
    console.log('No connected MetaMask account');
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.backgroundColor = 'red';
    popup.style.color = 'white';
    popup.style.padding = '10px';
    popup.style.textAlign = 'center';
    if (typeof window.ethereum == 'undefined') {
        popup.textContent = 'MetaMask isn\'t installed, please install it';
    }else{
        popup.textContent = 'Connect MetaMask Wallet';
    }

    // Aggiunta del popup al documento
    document.body.appendChild(popup);
    setTimeout(function() {
        popup.remove();
    }, 2000);
    return;
}

function checkInstalled() {
    if (typeof window.ethereum == 'undefined') {
    // connectWallet.innerText = 'MetaMask isnt installed, please install it'
    connectWallet.classList.remove()
    connectWallet.classList.add()
    connectWallet.addEventListener('click', errorMetamask)
    return false
    }
    connectWallet.addEventListener('click', connectWalletwithMetaMask)
}

async function connectWalletwithMetaMask() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((e) => {
    console.error(e.message)
    return
    })

    if (!accounts) { return }

    window.userWalletAddress = accounts[0]
    walletAddress.innerText = window.userWalletAddress

    connectWallet.innerText = 'Sign Out'
    connectWallet.removeEventListener('click', connectWalletwithMetaMask)
    setTimeout(() => {
    connectWallet.addEventListener('click', signOutOfMetaMask)
    }, 200)

}


function signOutOfMetaMask() {
    window.userwalletAddress = null
    walletAddress.innerText = ''
    connectWallet.innerText = 'Connect Wallet'

    connectWallet.removeEventListener('click', signOutOfMetaMask)
    setTimeout(() => {
    connectWallet.addEventListener('click', connectWalletwithMetaMask)
    }, 200  )
}

async function checkBalance() {
    let balance = await window.ethereum.request({ method: "eth_getBalance",
            params: [
                window.userWalletAddress,
                'latest'
                ]
            }).catch((err)=> {
                console.log(err)
        })

    console.log(parseFloat((balance) / Math.pow(10,18)))

    walletBalance.innerText = parseFloat((balance) / Math.pow(10,18))
}
