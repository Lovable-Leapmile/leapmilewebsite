import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { MapPin, Play, Tag, ArrowLeft, Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type EventItem = {
  id: string;
  title: string;
  location: string;
  description: string;
  videoUrl?: string;
  tags?: string[];
  caption?: string;
};

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();

  const events: EventItem[] = [
    {
      id: "IMS2025",
      title: "IMS 2025",
      location: "Bengaluru",
      description:
        "Leapmile Robotics showcased its cutting-edge warehouse automation and robotics systems at IMS 2025, Bengalore — connecting innovation, technology, and industry leaders under one roof.",
      videoUrl: "https://leapmile-website.blr1.digitaloceanspaces.com/Leapmile_IMS_EVENT.mp4",
      tags: ["#IMS2025", "#Bengaluru", "#LeapmileRobotics", "#Automation", "#Innovation"],
      caption: "Leapmile Robotics at IMS 2025: Powering the Future of Warehousing",
    },
  ];

  const event = events.find((e) => e.id === eventId);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeFlowIndex, setActiveFlowIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    "DSC07752.JPG",
    "DSC08039.JPG",
    "stall2.jpeg",
    "DSC08137.JPG",
    "DSC07864.JPG",
    "DSC07925.JPG",
    "DSC08174.JPG",
    "DSC08109.JPG",
    "DSC08321.JPG",
    "DSC08545.JPG",
    "DSC08698.JPG",
    "stall1.jpeg",
    "stall3.jpeg",
    "stall4.jpeg",
  ];

  const videoFlows: { title: string; seconds: number }[] = [
    { title: "Conveyor", seconds: 7 },
    { title: "Shuttle", seconds: 15 },
    { title: "Secure Baydoor", seconds: 36 },
    { title: "Scissor Lift", seconds: 47 },
    { title: "Smart Door", seconds: 70 },
    { title: "Pick to Light", seconds: 70 },
    { title: "Picker Arm", seconds: 79 },
    { title: "AMR", seconds: 113 },
  ];

  useEffect(() => {
    if (videoRef.current) {
      try {
        videoRef.current.playbackRate = 1.25;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      } catch (_) {
        // ignore autoplay rejection
      }
    }
  }, [eventId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event Not Found</h1>
          <Link to="/events" className="text-primary hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.title} - ${event.location}`,
    description: event.description,
    location: {
      "@type": "Place",
      name: event.location,
    },
    organizer: {
      "@type": "Organization",
      name: "Leapmile Robotics",
      url: "https://www.leapmile.com",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${event.title} - ${event.location} | Leapmile Robotics`}
        description={event.description}
        keywords={`${event.title}, ${event.location}, Leapmile Robotics, warehouse automation`}
        canonical={`/events/${eventId}`}
        schemaData={eventSchema}
      />

      <div className="pt-12" />

      <section className="container mx-auto px-6 md:px-12 py-10">
        <Link to="/events" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              {event.title} — {event.location}
            </h1>
            <p className="mt-2 text-muted-foreground">{event.description}</p>
          </div>

          {event.videoUrl && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-4/5">
                <div className="rounded-lg overflow-hidden border border-border">
                  <video
                    ref={videoRef}
                    src={event.videoUrl}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-auto"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <aside className="w-full md:w-1/5">
                <div className="border border-border rounded-lg p-3 md:p-4">
                  <div className="text-sm font-medium text-foreground mb-2">Robot Components</div>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                    {videoFlows.map((flow, index) => (
                      <button
                        key={flow.title}
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = flow.seconds;
                            try {
                              videoRef.current.play();
                              videoRef.current.playbackRate = 1.25;
                            } catch (_) {
                              // ignore
                            }
                          }
                          setActiveFlowIndex(index);
                        }}
                        className={`text-left text-xs md:text-sm px-3 py-2 rounded-md border transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${
                          activeFlowIndex === index
                            ? "border-primary bg-accent/40 text-accent-foreground"
                            : "border-border hover:bg-accent/30 hover:text-accent-foreground"
                        }`}
                      >
                        {flow.title}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-border text-muted-foreground"
                >
                  <Tag className="h-3 w-3" /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Event Gallery Section */}
      {eventId === "IMS2025" && (
        <section className="container mx-auto px-6 md:px-12 py-10">
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Event Gallery</h2>
              <p className="text-muted-foreground">
                Experience the highlights from our booth at IMS 2025 Bengaluru — showcasing live demonstrations,
                engaging conversations, and innovative warehouse automation solutions
              </p>
            </div>

            {/* Event Spotlight Video + Card */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] items-stretch">
              <div className="relative rounded-2xl border border-border bg-background/70 overflow-hidden">
                <div className="absolute inset-0 opacity-60 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-secondary/15" />
                <div className="relative p-2">
                  <div className="rounded-xl overflow-hidden aspect-video bg-muted shadow-lg shadow-primary/10">
                    <video
                      src="https://leapmile-website.blr1.cdn.digitaloceanspaces.com/IMS_Event.mp4"
                      controls
                      playsInline
                      poster={`https://leapmile-website.blr1.digitaloceanspaces.com/${galleryImages[0]}`}
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl border border-border bg-background/80 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 opacity-70 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-secondary/20" />
                <div className="relative h-full flex flex-col gap-6 p-6">
                  <div className="space-y-3">
                    <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Event Spotlight</p>
                    <h3 className="text-2xl font-semibold text-foreground">Leapmile Robotics Leads the Future</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Live autonomous demos, smart warehouse systems, and seamless robotics at Bengaluru’s premier
                      automation showcase. Collaborations sparked across industry leaders, reinforcing Leapmile’s role at
                      the forefront of India’s automation landscape.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl border border-border/60 p-4 bg-background/70">
                      <p className="text-muted-foreground uppercase tracking-wide text-[11px]">Location</p>
                      <p className="text-foreground font-semibold mt-1">Bengaluru</p>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4 bg-background/70">
                      <p className="text-muted-foreground uppercase tracking-wide text-[11px]">Focus</p>
                      <p className="text-foreground font-semibold mt-1">Autonomous Warehousing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Hero Image */}
            <figure
              className="rounded-lg overflow-hidden group relative cursor-pointer mb-6 aspect-video bg-muted"
              onClick={() => openLightbox(0)}
            >
              <img
                src={`https://leapmile-website.blr1.digitaloceanspaces.com/${galleryImages[0]}`}
                alt="IMS 2025 Featured Event Photo"
                className="w-full h-full object-cover will-change-transform group-hover:scale-105 transition-transform duration-700"
                loading="eager"
                decoding="async"
                width="1200"
                height="675"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </figure>

            {/* Second Featured Image - Stall View */}
            <figure
              className="rounded-lg overflow-hidden group relative cursor-pointer mb-6 aspect-video bg-muted"
              onClick={() => openLightbox(13)}
            >
              <img
                src="https://leapmile-website.blr1.digitaloceanspaces.com/stall4.jpeg"
                alt="IMS 2025 Stall Overview"
                className="w-full h-full object-cover will-change-transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
                width="1200"
                height="675"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </figure>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {galleryImages.slice(1, 13).map((image, index) => (
                <figure
                  key={index}
                  className="rounded-lg overflow-hidden group relative cursor-pointer aspect-[4/3] bg-muted"
                  onClick={() => openLightbox(index + 1)}
                >
                  <img
                    src={`https://leapmile-website.blr1.digitaloceanspaces.com/${image}`}
                    alt={`IMS 2025 Event Photo ${index + 2}`}
                    className="w-full h-full object-cover will-change-transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="300"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Brochure Section */}
      {eventId === "IMS2025" && (
        <section className="container mx-auto px-6 md:px-12 py-10">
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Event Brochure</h2>
              <p className="text-muted-foreground">
                Download our comprehensive brochure to learn more about Leapmile Robotics' warehouse automation
                solutions and discover how we're transforming logistics and fulfillment operations
              </p>
            </div>

            {/* Brochure Images */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <figure className="rounded-lg overflow-hidden border border-border">
                <img
                  src="https://leapmile-website.blr1.cdn.digitaloceanspaces.com/Brochuer F.jpg"
                  alt="Leapmile Robotics Brochure - Front"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </figure>
              <figure className="rounded-lg overflow-hidden border border-border">
                <img
                  src="https://leapmile-website.blr1.cdn.digitaloceanspaces.com/Broucher B.jpg"
                  alt="Leapmile Robotics Brochure - Back"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </figure>
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <Button asChild size="lg" className="w-full md:w-auto">
                <a
                  href="https://leapmile-website.blr1.digitaloceanspaces.com/leapmile_brochure.pdf"
                  download="Leapmile_Brochure.pdf"
                  className="inline-flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Brochure
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-[95vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <img
              src={`https://leapmile-website.blr1.digitaloceanspaces.com/${galleryImages[currentImageIndex]}`}
              alt={`IMS 2025 Event Photo ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EventDetail;
