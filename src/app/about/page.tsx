'use client';

import React from 'react';
import { Zap, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="bg-slate-50 min-h-[70vh] dark:bg-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Our Story</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Founded in 2023, Electro was born from a simple idea: to make the latest technology accessible to everyone. 
              We&apos;re a team of tech enthusiasts who believe that innovation should be effortless and exciting. 
              We&apos;ve dedicated ourselves to curating a selection of products that are not only high-performing but also beautifully designed.
            </p>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              From the smallest smart gadget to the most powerful computing device, every product on our platform is hand-picked 
              and rigorously tested. We stand behind our products with a commitment to quality and customer service that is second to none.
            </p>
          </div>
          <div className="h-full w-full rounded-2xl overflow-hidden shadow-xl">
            <Image 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop" 
              alt="Our office" 
              width={600}
              height={400}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Our Values</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-950">
              <Zap className="h-10 w-10 text-slate-900 dark:text-slate-50 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold dark:text-white">Innovation</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                We constantly seek out the latest and greatest in technology to bring you products that shape the future.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-950">
              <ShieldCheck className="h-10 w-10 text-slate-900 dark:text-slate-50 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold dark:text-white">Quality</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Our products are chosen for their reliability and performance, ensuring you get the best value for your money.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-950">
              <Heart className="h-10 w-10 text-red-500 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold dark:text-white">Customer First</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Your satisfaction is our priority. We&apos;re here to help you every step of the way.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-center">Our Team</h2>
          <div className="mt-8 grid md:grid-cols-4 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
              { name: 'Michael Chen', role: 'Head of Technology', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' },
              { name: 'Emily Rodriguez', role: 'Product Curator', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop' },
              { name: 'David Kim', role: 'Customer Experience', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg dark:border-slate-800">
                  <Image
                    src={member.image || 'images/placeholder.jpg'}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold dark:text-white">{member.name}</h3>
                <p className="text-slate-600 dark:text-slate-300">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;