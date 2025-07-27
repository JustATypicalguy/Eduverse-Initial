import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin } from "lucide-react";
import type { InsertContact } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertContact>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contacts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We will get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Send Message",
        description: error instanceof Error ? error.message : "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    contactMutation.mutate(formData);
  };

  const updateFormData = (field: keyof InsertContact, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-24">
      {/* Contact Header */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
            <p className="text-xl text-nilo-gray max-w-3xl mx-auto">
              Ready to join our global learning community? Get in touch with our admissions team for more information.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center bg-nilo-light">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-nilo-blue rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="text-white" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                    <p className="text-nilo-gray">+1 (555) 123-4567</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center bg-nilo-light">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-nilo-blue rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="text-white" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-nilo-gray">admissions@nilo.edu</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center bg-nilo-light">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-nilo-blue rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                    <p className="text-nilo-gray">123 Education Ave<br />Global City, GC 12345</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Map Placeholder */}
              <Card className="bg-gray-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-400">Campus Location</p>
                </div>
              </Card>
            </div>
            
            {/* Contact Form */}
            <Card className="bg-nilo-light">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      placeholder="Your full name"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => updateFormData("subject", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admissions">Admissions Inquiry</SelectItem>
                        <SelectItem value="programs">Academic Programs</SelectItem>
                        <SelectItem value="visit">Campus Visit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => updateFormData("message", e.target.value)}
                      placeholder="How can we help you?"
                      required
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-nilo-blue text-white hover:bg-nilo-dark"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
