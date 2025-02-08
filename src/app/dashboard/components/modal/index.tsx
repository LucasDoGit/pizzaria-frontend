"use client"
import styles from './styles.module.scss';
import { X } from 'lucide-react';
import { useContext } from 'react'
import { OrderContext } from '@/providers/order'
import { calculateTotalOrder } from '@/lib/helper';

export function ModalOrder(){
    const { onRequestClose, order, finishOrder } = useContext(OrderContext);

    async function hadleFinishOrder(){
        await finishOrder(order[0].order_id)
    }

    return(
        <dialog className={styles.dialogContainer}>
            <section className={styles.dialogContent}>
                <button 
                    className={styles.dialogBack} 
                    onClick={onRequestClose}
                >
                    <X size={40} color="#FF3f4b" />
                </button>

                <article className={styles.container}>
                    <h2>Detalhes do pedido</h2>

                    <span className={styles.table}>
                        Mesa <b>{order[0].order.table}</b>
                    </span>
                    
                    {order[0].order?.name && (
                        <span className={styles.name}>
                            Nome: <b>{order[0].order?.name}</b>
                        </span>
                    )}

                    {order.map(orderItem => (
                        <section key={orderItem.id} className={styles.item}>
                            <span>
                                Qtd: {orderItem.amount} - <b>{orderItem.product.name}</b> - R$ {parseFloat(orderItem.product.price) * 
                                orderItem.amount}
                            </span>
                            <span className={styles.description}>{orderItem.product.description}</span>
                        </section>
                    ))}

                    <h3 className={styles.total}>Valor total: R$ {calculateTotalOrder(order)}</h3>

                    <button className={styles.buttonOrder} onClick={hadleFinishOrder}>
                        Concluir pedido
                    </button>

                </article>

            </section>
        </dialog>
    )
}