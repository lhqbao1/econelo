import { CheckCircle2, Contact2, CarFront, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const MissionSection = () => {
    return (
        <section className="w-full py-12 bg-white flex justify-center">
            <div className="w-11/12 lg:w-7/12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* LEFT — IMAGES */}
                <div className="relative flex items-center h-full">
                    {/* Image 1 (Background image) */}
                    <div className="absolute left-0 top-0 w-[340px] h-[340px] rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/mission-image-1.jpg"
                            alt="Charging scooter"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Image 2 (Foreground image - overlapping) */}
                    <div className="absolute -bottom-4 -right-2 w-[340px] h-[340px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                        <Image
                            src="/mission-image-2.jpg"
                            alt="Riding scooter"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Circle badge */}
                    <div className="absolute -top-0 right-0 -translate-x-1/3 bg-primary text-white w-[110px] h-[110px] rounded-full flex flex-col items-center justify-center font-semibold shadow-md border-4 border-white">
                        <span className="text-2xl font-bold">85%</span>
                        <span className="text-sm">Clients</span>
                    </div>
                </div>

                {/* RIGHT — TEXT CONTENT */}
                <div className="space-y-6">
                    {/* Subheading */}
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span className="uppercase font-semibold tracking-wide text-sm text-gray-500">
                            What We Do!
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl font-bold leading-tight">
                        Our mission is to put an electric vehicle charge
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 leading-relaxed">
                        Charge your electric vehicle at home using one of our smart home charge
                        solutions or gain access to over 3,000 public charging stations.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Contact2 className="text-primary w-6 h-6" />
                                <span className="font-semibold">Zero contact travel</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-snug">
                                We love our customers and we love the way they come.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <CarFront className="text-primary w-6 h-6" />
                                <span className="font-semibold">No Driving License</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-snug">
                                We love our customers and we love the way they come.
                            </p>
                        </div>
                    </div>

                    {/* Check list */}
                    <ul className="space-y-2 mt-4">
                        <li className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="text-primary w-5 h-5" />
                            <span>
                                <strong>Detachable battery,</strong> take home and charge in 3 hours.
                            </span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="text-primary w-5 h-5" />
                            <span>
                                <strong>Enjoy a hassle-free ride</strong> by charging just for 3 hours.
                            </span>
                        </li>
                    </ul>

                    {/* Button */}
                    <Button
                        variant="default"
                        className="bg-black hover:bg-primary hover:text-white text-white mt-6 rounded-none px-8 py-6 text-sm uppercase font-semibold tracking-wide flex items-center gap-2"
                    >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default MissionSection
