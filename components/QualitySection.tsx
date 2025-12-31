import React from 'react';

const QualitySection: React.FC = () => {
    // Placeholder for Admin Uploaded Banner
    // In the future, this URL will come from the Admin Settings (Supabase Storage/Database)
    const adminBannerUrl = "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=2000";

    return (
        <section className="w-full">
            <div className="w-full h-auto min-h-[300px] md:min-h-[400px] lg:min-h-[500px] relative bg-gray-200">
                {adminBannerUrl ? (
                    <img
                        src={adminBannerUrl}
                        alt="Banner Promocional"
                        className="w-full h-full object-cover max-h-[600px]"
                    />
                ) : (
                    // Fallback if no image is uploaded
                    <div className="w-full h-[400px] flex items-center justify-center text-gray-400 font-display uppercase tracking-widest text-xl border-2 border-dashed border-gray-300">
                        Espaço para Banner (Configurável)
                    </div>
                )}
            </div>
        </section>
    );
};

export default QualitySection;