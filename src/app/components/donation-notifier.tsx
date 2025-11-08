/*
 * 
 *  ═══════════════════════════════════════════════════
 *   [USUÁRIO]: Painho_Dev
 *   [DISCORD]: painhodev
 *   [CARGO]: Criador Profissional de Bugs
 *   [HABILIDADES]: Criar bugs novos, Consertar bugs antigos
 *   [STATUS]: Funcionou na minha máquina! 🤷
 *  ═══════════════════════════════════════════════════
 *            \
 *             \     ^__^
 *              \   (oo)\_______
 *                 (__)\       )\/\\
 *                     ||----Ō |
 *                     ||     ||
 * 
 * 
 */
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const donorNames = [
    'Maria', 'João', 'Ana', 'Carlos', 'Fernanda', 'Paulo', 'Juliana', 'Ricardo', 'Patrícia', 'Marcos',
    'Rafael', 'Camila', 'Bruno', 'Larissa', 'Gustavo', 'Bianca', 'Felipe', 'Carla', 'Diego', 'Vanessa',
    'Roberta', 'Eduardo', 'André', 'Daniela', 'Luana', 'Thiago', 'Priscila', 'Leandro', 'Natália', 'Sérgio'
];
const amounts = [30, 50, 75, 100, 150, 200, 250];

function formatBRL(n: number) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type Notification = {
    id: number;
    name: string;
    amount: number;
    show: boolean;
};

export function DonationNotifier() {
    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const showDonationNotification = () => {
            const name = donorNames[Math.floor(Math.random() * donorNames.length)];
            const amount = amounts[Math.floor(Math.random() * amounts.length)];
            const id = Date.now();
            
            // Show new notification
            setNotification({ id, name, amount, show: true });

            // Hide notification after a while
            setTimeout(() => {
                setNotification(prev => (prev?.id === id ? { ...prev, show: false } : prev));
            }, 4000); // visible for 4s
            
            // Remove from DOM after transition
            setTimeout(() => {
                setNotification(prev => (prev?.id === id ? null : prev));
            }, 4500); // remove after 4.5s
        };

        const intervalId = setInterval(showDonationNotification, 7000); // new notification every 7s
        
        // show first notification almost immediately
        setTimeout(showDonationNotification, 1500);

        return () => clearInterval(intervalId);
    }, []);

    if (!notification) {
        return null;
    }

    return (
        <div className={`notificacao ${notification.show ? 'show' : ''}`}>
            <div className="avatar">
                <Image src="https://picsum.photos/seed/avatar1/40/40" alt={notification.name} width={40} height={40} className='rounded-full' />
            </div>
            <div className="content">
                <h4>{notification.name}</h4>
                <p>doou R$ {formatBRL(notification.amount)}</p>
            </div>
        </div>
    );
}
