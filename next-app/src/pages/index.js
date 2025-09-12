import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import Banner from "@/components/home/Banner";
import QuickSection from "@/components/home/QuickSection";
import HomeContent from "@/components/home/HomeContent";


export default function Home() {
    return (
        <div>
            <MainLayout>
                <Banner />
                <QuickSection />
                <HomeContent />
            </MainLayout>
        </div>
    )
}