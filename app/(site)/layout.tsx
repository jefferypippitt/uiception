import Header from '@/components/header'
import Footer from '@/components/footer'

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex min-h-screen flex-col'>
            <Header />
            <main className='flex-1 pt-5 md:pt-6'>{children}</main>
            <Footer />
        </div>
    )
}