// src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Gem, Award, Users, Truck, Heart } from 'lucide-react';

const StatCard = ({ value, label }) => (
    <div className="text-center">
        <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">{value}</p>
        <p className="text-sm md:text-base text-white/90">{label}</p>
    </div>
);

const ValueCard = ({ icon, title, text }) => (
    <motion.div 
        className="bg-white p-6 rounded-lg shadow-lg text-center"
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    >
        <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{text}</p>
    </motion.div>
);

export default function AboutPage() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
        >
            {/* --- Banner Superior --- */}
            <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white text-center py-16 px-4 rounded-lg shadow-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Acerca de Ferremax</h1>
                <p className="text-lg md:text-xl">Más de 25 años proporcionando las mejores herramientas y equipos para profesionales y aficionados.</p>
            </div>

            {/* --- Nuestra Historia --- */}
            <section className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="prose max-w-none text-gray-700">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestra Historia</h2>
                        <p>
                            Desde 1999, Ferretería Ferremax ha sido un pilar fundamental en la industria de la construcción local. Lo que comenzó como un sueño de la familia Rodríguez en una pequeña tienda de barrio, ha florecido hasta convertirse en un referente de confianza, calidad y servicio excepcional en toda la región.
                        </p>
                        <p>
                            Nuestra pasión por las herramientas de calidad y el servicio al cliente nos ha impulsado a construir relaciones duraderas, no solo con nuestros clientes, sino también con nuestros proveedores. Cada producto en nuestro extenso catálogo ha sido cuidadosamente seleccionado por nuestro equipo de expertos para garantizar que solo ofrecemos lo mejor.
                        </p>
                        <p>
                           Hoy, con más de dos décadas de experiencia, servimos con orgullo a miles de clientes en todo el país, ofreciendo desde herramientas básicas para el hogar hasta equipos profesionales de última generación, siempre con el compromiso de apoyar cada proyecto hacia el éxito.
                        </p>
                    </div>
                    <motion.div 
                        className="rounded-lg overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <img 
                            src="https://art-envis.com/media/conentImage/istockphoto-1310942446-612x612.jpg" 
                            alt="Equipo de Ferremax trabajando" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* --- Misión y Visión --- */}
            <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-l-4 border-orange-500 bg-white p-6 rounded-r-lg shadow-md">
                    <div className="flex items-center mb-3">
                        <Target className="text-orange-500 mr-3" size={28}/>
                        <h3 className="text-2xl font-bold text-gray-800">Nuestra Misión</h3>
                    </div>
                    <p className="text-gray-600">Proporcionar herramientas y equipos de la más alta calidad a precios competitivos, respaldados por un servicio al cliente excepcional y asesoramiento experto. Queremos ser el socio confiable para todos tus proyectos.</p>
                </div>
                <div className="border-l-4 border-green-600 bg-white p-6 rounded-r-lg shadow-md">
                    <div className="flex items-center mb-3">
                        <Eye className="text-green-600 mr-3" size={28}/>
                        <h3 className="text-2xl font-bold text-gray-800">Nuestra Visión</h3>
                    </div>
                    <p className="text-gray-600">Ser la ferretería online líder en el país, reconocida por nuestra innovación, calidad de servicio y compromiso con la satisfacción del cliente. Aspiramos a hacer que cada proyecto sea un éxito rotundo.</p>
                </div>
            </section>

             {/* --- Nuestros Valores --- */}
             <section className="container mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Nuestros Valores</h2>
                <p className="text-gray-600 mb-8">Los principios que guían todo lo que hacemos</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ValueCard icon={<Award className="text-orange-500" size={24}/>} title="Calidad Garantizada" text="Trabajamos solo con las mejores marcas y productos de máxima calidad."/>
                    <ValueCard icon={<Users className="text-orange-500" size={24}/>} title="Atención Personalizada" text="Nuestro equipo de expertos está siempre disponible para asesorarte."/>
                    <ValueCard icon={<Truck className="text-orange-500" size={24}/>} title="Entrega Rápida" text="Envíos rápidos y seguros a todo el país en tiempo récord."/>
                    <ValueCard icon={<Heart className="text-orange-500" size={24}/>} title="Pasión por las Herramientas" text="Amamos lo que hacemos y se nota en cada producto que vendemos."/>
                </div>
            </section>

            {/* --- Banner de Estadísticas --- */}
            <div className="bg-gray-800 py-12">
                <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard value="25+" label="Años de Experiencia"/>
                    <StatCard value="5000+" label="Clientes Satisfechos"/>
                    <StatCard value="50+" label="Marcas de Confianza"/>
                    <StatCard value="99%" label="Satisfacción del Cliente"/>
                </div>
            </div>

            {/* --- Nuestro Compromiso --- */}
            <section className="container mx-auto text-center max-w-3xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Nuestro Compromiso Contigo</h2>
                <p className="text-gray-600 mb-8">
                    En Ferremax, no solo vendemos herramientas; construimos relaciones. Cada producto que ofrecemos viene respaldado por nuestra garantía de calidad y nuestro compromiso inquebrantable con tu satisfacción. Tu éxito es nuestro éxito.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-r-lg italic">
                    <p>"La calidad no es un acto, es un hábito" - Este principio guía cada decisión que tomamos en Ferremax.</p>
                </div>
            </section>
        </motion.div>
    );
}