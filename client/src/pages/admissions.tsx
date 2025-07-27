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
import type { InsertApplication } from "@shared/schema";

export default function Admissions() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertApplication>({
    studentFirstName: "",
    studentLastName: "",
    gradeLevel: "",
    academicYear: "",
    parentEmail: "",
    phoneNumber: "",
    additionalInfo: "",
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your application. We will review it and get back to you soon.",
      });
      setFormData({
        studentFirstName: "",
        studentLastName: "",
        gradeLevel: "",
        academicYear: "",
        parentEmail: "",
        phoneNumber: "",
        additionalInfo: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentFirstName || !formData.studentLastName || !formData.gradeLevel || 
        !formData.academicYear || !formData.parentEmail || !formData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    applicationMutation.mutate(formData);
  };

  const updateFormData = (field: keyof InsertApplication, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-24">
      {/* Admissions Header */}
      <section className="py-20 bg-nilo-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Admissions</h1>
            <p className="text-xl text-nilo-gray max-w-3xl mx-auto">
              Join our diverse international community. We welcome students from all backgrounds 
              who are ready to embrace global learning.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Application Process */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Application Process</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-nilo-blue rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Submit Application</h4>
                      <p className="text-gray-600">
                        Complete our online application form with student information and academic records.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-nilo-blue rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Assessment & Interview</h4>
                      <p className="text-gray-600">
                        Age-appropriate assessment and family interview to understand student needs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-nilo-blue rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Documentation</h4>
                      <p className="text-gray-600">
                        Provide required documents including transcripts, recommendations, and health records.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-nilo-blue rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Enrollment</h4>
                      <p className="text-gray-600">
                        Upon acceptance, complete enrollment process and prepare for orientation.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-nilo-light rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Important Dates</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Application Deadline:</span>
                      <span className="font-medium">March 31, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assessment Period:</span>
                      <span className="font-medium">April 1-30, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollment Deadline:</span>
                      <span className="font-medium">May 15, 2025</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Application Form */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Application Form</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studentFirstName">Student First Name *</Label>
                      <Input
                        id="studentFirstName"
                        type="text"
                        value={formData.studentFirstName}
                        onChange={(e) => updateFormData("studentFirstName", e.target.value)}
                        placeholder="Enter first name"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentLastName">Student Last Name *</Label>
                      <Input
                        id="studentLastName"
                        type="text"
                        value={formData.studentLastName}
                        onChange={(e) => updateFormData("studentLastName", e.target.value)}
                        placeholder="Enter last name"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gradeLevel">Grade Level *</Label>
                      <Select value={formData.gradeLevel} onValueChange={(value) => updateFormData("gradeLevel", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="grade1">Grade 1</SelectItem>
                          <SelectItem value="grade2">Grade 2</SelectItem>
                          <SelectItem value="grade3">Grade 3</SelectItem>
                          <SelectItem value="grade4">Grade 4</SelectItem>
                          <SelectItem value="grade5">Grade 5</SelectItem>
                          <SelectItem value="grade6">Grade 6</SelectItem>
                          <SelectItem value="grade7">Grade 7</SelectItem>
                          <SelectItem value="grade8">Grade 8</SelectItem>
                          <SelectItem value="grade9">Grade 9</SelectItem>
                          <SelectItem value="grade10">Grade 10</SelectItem>
                          <SelectItem value="grade11">Grade 11</SelectItem>
                          <SelectItem value="grade12">Grade 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="academicYear">Academic Year *</Label>
                      <Select value={formData.academicYear} onValueChange={(value) => updateFormData("academicYear", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                          <SelectItem value="2026-2027">2026-2027</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="parentEmail">Parent/Guardian Email *</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => updateFormData("parentEmail", e.target.value)}
                      placeholder="parent@example.com"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo || ""}
                      onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                      placeholder="Tell us about your child's interests, special needs, or any questions you have..."
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-nilo-blue text-white hover:bg-nilo-dark"
                    disabled={applicationMutation.isPending}
                  >
                    {applicationMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
