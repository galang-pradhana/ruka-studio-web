"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

interface WhyUsProps {
  data?: Record<string, string>;
}

export function WhyUsSection({ data }: WhyUsProps) {
  const { language } = useLanguage();

  const title = language === 'EN'
    ? (data?.titleEN || "WHY US")
    : (data?.titleID || data?.title || "MENGAPA KAMI");

  const description = language === 'EN'
    ? (data?.descriptionEN || "We build meaningful spaces, focusing on precision and material quality.")
    : (data?.descriptionID || data?.description || "Kami membangun ruang yang bermakna, berfokus pada ketelitian dan kualitas material.");

  const stats = [
    { 
      value: language === 'EN' ? (data?.stat1ValueEN || "250+") : (data?.stat1ValueID || data?.stat1Value || "250+"), 
      label: language === 'EN' ? (data?.stat1LabelEN || "Completed Projects") : (data?.stat1LabelID || data?.stat1Label || "Proyek Selesai") 
    },
    { 
      value: language === 'EN' ? (data?.stat2ValueEN || "15+") : (data?.stat2ValueID || data?.stat2Value || "15+"), 
      label: language === 'EN' ? (data?.stat2LabelEN || "Years Experience") : (data?.stat2LabelID || data?.stat2Label || "Tahun Pengalaman") 
    },
    { 
      value: language === 'EN' ? (data?.stat3ValueEN || "98%") : (data?.stat3ValueID || data?.stat3Value || "98%"), 
      label: language === 'EN' ? (data?.stat3LabelEN || "Happy Clients") : (data?.stat3LabelID || data?.stat3Label || "Klien Puas") 
    },
  ];

  const points = [
    {
      title: language === 'EN' ? (data?.point1EN || "Premium Materials") : (data?.point1ID || data?.point1 || "Material Premium"),
      desc: language === 'EN' ? (data?.point1DescEN || "Every material is chosen for its quality, durability, and long-term aesthetic.") : (data?.point1DescID || data?.point1Desc || "Setiap material dipilih berdasarkan kualitas, durabilitas, dan estetika jangka panjang."),
    },
    {
      title: language === 'EN' ? (data?.point2EN || "Sustainable Design") : (data?.point2ID || data?.point2 || "Desain Berkelanjutan"),
      desc: language === 'EN' ? (data?.point2DescEN || "A design approach that balances function, efficiency, and beauty.") : (data?.point2DescID || data?.point2Desc || "Pendekatan desain yang mempertimbangkan fungsi, efisiensi, dan keindahan secara bersamaan."),
    },
    {
      title: language === 'EN' ? (data?.point3EN || "Precision Execution") : (data?.point3ID || data?.point3 || "Eksekusi Presisi"),
      desc: language === 'EN' ? (data?.point3DescEN || "Experienced teams ensuring every detail is completed on time and to specification.") : (data?.point3DescID || data?.point3Desc || "Tim berpengalaman yang memastikan setiap detail selesai tepat waktu dan sesuai spesifikasi."),
    },
  ];

  return (
    <section
      id="why-us"
      className="py-28 relative overflow-hidden scroll-mt-24"
      style={{
        backgroundColor: "#FCFAF6",
        borderTop: "1px solid rgba(10,6,8,0.06)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-8 md:px-14 relative z-10">

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-28 pb-16"
          style={{ borderBottom: "1px solid rgba(10,6,8,0.08)" }}
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center">
              <h4
                className="font-bold mb-2"
                style={{
                  fontFamily: "var(--font-cinzel, serif)",
                  fontSize: "clamp(32px, 5vw, 52px)",
                  letterSpacing: "-0.03em",
                  color: "#0B2240",
                }}
              >
                {stat.value}
              </h4>
              <p
                className="uppercase font-medium"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  fontFamily: "var(--font-montserrat, sans-serif)",
                  color: "rgba(10,6,8,0.4)",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <p
            className="uppercase font-semibold mb-6"
            style={{
              fontSize: "10px",
              letterSpacing: "0.35em",
              fontFamily: "var(--font-montserrat, sans-serif)",
              color: "#A4855C",
            }}
          >
            {title}
          </p>
          <h2
            className="font-bold leading-tight"
            style={{
              fontSize: "clamp(24px, 3vw, 38px)",
              fontFamily: "var(--font-cinzel, serif)",
              color: "#0B2240",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {description}
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="group relative flex flex-col justify-between text-left overflow-hidden transition-all duration-500 hover:-translate-y-1"
              style={{
                padding: "36px 32px",
                border: "1px solid rgba(10,6,8,0.08)",
                backgroundColor: "#fff",
                borderRadius: "2px",
              }}
            >
              {/* Hover gold left bar */}
              <div
                className="absolute top-0 left-0 w-[2px] h-0 group-hover:h-full transition-all duration-500"
                style={{ backgroundColor: "#A4855C" }}
              />

              <div className="relative z-10 space-y-5">
                {/* Index badge */}
                <div
                  className="flex items-center justify-center font-bold"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "999px",
                    border: "1.5px solid rgba(197,168,128,0.3)",
                    fontSize: "13px",
                    fontFamily: "var(--font-cinzel, serif)",
                    color: "#A4855C",
                    backgroundColor: "rgba(197,168,128,0.06)",
                  }}
                >
                  0{idx + 1}
                </div>
                <h3
                  className="font-bold"
                  style={{
                    fontSize: "18px",
                    fontFamily: "var(--font-montserrat, sans-serif)",
                    color: "#0B2240",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {point.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-montserrat, sans-serif)",
                    color: "rgba(10,6,8,0.55)",
                    lineHeight: 1.75,
                  }}
                >
                  {point.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
