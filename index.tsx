'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wallet, ShoppingBag, Search, Check } from 'lucide-react'
import { TonConnectButton } from '@tonconnect/ui-react'
import TonConnect from '@tonconnect/sdk'

// Initialize TonConnect
const tonConnect = new TonConnect({
  manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json'
})

export default function Component() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isBought, setIsBought] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      const walletConnectionSource = await tonConnect.getWalletConnectionSource()
      setIsConnected(!!walletConnectionSource)
    }
    checkConnection()
  }, [])

  const buyWithTon = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first.")
      return
    }

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
        messages: [
          {
            address: 'UQAYW4FbN_PFawE0K1FUqr3f2wXllR3BNhJJmrQEuIk9IERw',
            amount: '99990000', // 0.09999 TON (assuming the price is in nanotons)
          },
        ],
      }

      const result = await tonConnect.sendTransaction(transaction)
      if (result) {
        setIsBought(true)
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      alert('Transaction failed. Please try again.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">TON Storefront</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <TonConnectButton />
            <div className="flex space-x-2">
              {[0, 0, 0].map((_, index) => (
                <div key={index} className={`w-3 h-3 rounded-full ${index === 2 ? 'bg-red-500' : 'bg-green-500'}`} />
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="I'm looking for..."
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4 text-center">
              <img
                src="/placeholder.svg?height=150&width=300"
                alt="Product"
                className="w-full rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold">Exclusive Digital Product</h3>
              <p className="text-2xl font-bold mt-1">0.09999 TON</p>
              <p className="text-sm text-green-400 mb-3">∞ in stock</p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                onClick={buyWithTon}
                disabled={!isConnected || isBought}
              >
                {isBought ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Product Purchased
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" /> Buy with TON
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          {isBought && (
            <div className="text-center text-green-400">
              <p>Transaction successful!</p>
              <p>Get your product from: <a href="https://t.me/shopx" className="underline" target="_blank" rel="noopener noreferrer">t.me/shopx</a></p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
