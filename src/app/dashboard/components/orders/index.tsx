"use client"
import { OrderProps } from '@/lib/order.type'
import styles from './styles.module.scss'
import { RefreshCcw } from 'lucide-react'
import { ModalOrder } from '../modal'
import { useContext } from 'react'
import { OrderContext } from '@/providers/order'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface OrderResponse {
    orders: OrderProps[]
}

export function Orders({ orders }: OrderResponse){
    const { isOpen, onRequestOpen } = useContext(OrderContext);
    const router = useRouter()

    async function handleDetailOrder(order_id: string){
        await onRequestOpen(order_id)
    }

    function handleRefresh(){
        router.refresh()
        toast.success("Pedidos atualizados com sucesso!")
    }

    return(
        <>
            <main className={styles.container}>
            
            <section className={styles.containerHeader}> 
                <h1>Ultimos Pedidos</h1>
                <button onClick={handleRefresh}>
                    <RefreshCcw size={24} color='#3fffa3'/>
                </button>
            </section>

            <section className={styles.listOrders}>
                
                {orders.length === 0 && (
                    <span className={styles.emptyItem}>
                        nenhum pedido aberto no momento...
                    </span>
                )}

                {orders.map((orderItem) => (
                    <button 
                        className={styles.orderItem} 
                        key={orderItem.id}
                        onClick={() => handleDetailOrder(orderItem.id)}
                    >
                        <div className={styles.tag}></div>
                        <span>Mesa {orderItem.table}</span>
                    </button>
                ))}

            </section>

            </main>

            { isOpen && <ModalOrder /> }
        </>

    )
}