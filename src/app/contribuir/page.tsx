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
import { Suspense } from 'react';
import { DonationForm } from './_components/donation-form';
import { Skeleton } from '@/components/ui/skeleton';


function DonationFormSkeleton() {
    return (
        <div className="w-full max-w-lg mx-auto p-6">
            <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-6 w-1/3 mx-auto mb-8" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="grid grid-cols-3 gap-2 mb-4">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
            </div>
             <Skeleton className="h-14 w-full" />
        </div>
    )
}

export default function ContribuirPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Suspense fallback={<DonationFormSkeleton />}>
                <DonationForm />
            </Suspense>
        </div>
    );
}