
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy, User, Phone, Mail, MapPin, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'everrideVCardData';

const defaultBusinessInfo = {
  name: 'Biniam',
  company: 'Everride',
  tagline: 'Professional Chauffeur Service',
  phone: '+1 (604) 728-1620',
  email: 'bigmedusa2006@gmail.com',
  address: 'Surrey, BC, Canada',
  bookingUrl: 'https://df586b48-a3b9-430a-8b5c-783b73067c79-00-1mifz0bzjnx0r.spock.replit.dev/book'
};

export function VCard() {
  const { toast } = useToast();

  const [businessInfo, setBusinessInfo] = useState(defaultBusinessInfo);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setBusinessInfo(JSON.parse(stored));
      }
    } catch {
      // If parsing fails, stick with default
    }
  }, []);

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Save businessInfo to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(businessInfo));
    }
  }, [businessInfo, isMounted]);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(businessInfo.bookingUrl)}`;

  const copyBookingLink = async () => {
    try {
      await navigator.clipboard.writeText(businessInfo.bookingUrl);
      toast({
        title: 'Link copied!',
        description: 'Booking URL copied to clipboard'
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy link to clipboard',
        variant: 'destructive'
      });
    }
  };

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  const handleInputChange = (field: keyof typeof businessInfo, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isMounted) {
    return null; // or a loading skeleton
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Premium Business Card */}
      <Card className="bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="space-y-2">
            {/* Business Logo/Icon */}
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>

            {/* Name & Company */}
            {isEditing ? (
              <div className="space-y-2 p-2">
                <Input
                  type="text"
                  value={businessInfo.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="w-full text-center text-2xl font-bold text-card-foreground bg-transparent p-1 border-b"
                  placeholder="Name"
                />
                <Input
                  type="text"
                  value={businessInfo.company}
                  onChange={e => handleInputChange('company', e.target.value)}
                  className="w-full text-center text-xl font-semibold text-primary bg-transparent p-1 border-b"
                  placeholder="Company"
                />
                <Input
                  type="text"
                  value={businessInfo.tagline}
                  onChange={e => handleInputChange('tagline', e.target.value)}
                  className="w-full text-center text-sm text-muted-foreground bg-transparent p-1 border-b"
                  placeholder="Tagline"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-card-foreground">{businessInfo.name}</h2>
                <h3 className="text-xl font-semibold text-primary">{businessInfo.company}</h3>
                <p className="text-sm text-muted-foreground mt-1">{businessInfo.tagline}</p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* QR Code Section */}
          <div
            className="flex flex-col items-center space-y-3 p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border/30 cursor-pointer"
            onClick={() => setIsQRModalOpen(true)}
          >
            <img
              src={qrCodeUrl}
              alt="Everride QR Code"
              width="128"
              height="128"
              className="rounded-lg"
            />
            <div className="text-center">
              <p className="text-sm font-medium text-card-foreground">Scan to Book a Ride</p>
              <p className="text-xs text-muted-foreground">Tap QR code to enlarge</p>
            </div>
          </div>

          {/* Booking URL input */}
          {isEditing && (
             <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Booking URL</label>
              <Input
                type="url"
                value={businessInfo.bookingUrl}
                onChange={e => handleInputChange('bookingUrl', e.target.value)}
                className="w-full bg-input rounded-md p-2 text-sm"
                placeholder="Booking URL"
              />
            </div>
          )}

          {/* Looking for Savings Text */}
          <div className="text-center">
            <p className="text-lg font-bold text-primary mb-3">Looking for Savings?</p>
          </div>

          {/* Book Online Button */}
          <Button
            onClick={copyBookingLink}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground rounded-xl h-12 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Book Online
          </Button>

          {/* Contact Information Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={toggleContactInfo}
                variant="ghost"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors duration-200"
              >
                {showContactInfo ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide Contact Info
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show Contact Info
                  </>
                )}
              </Button>

              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="text-sm"
              >
                {isEditing ? 'Save' : 'Edit Info'}
              </Button>
            </div>

            {/* Contact Details - Hidden by default */}
            <div
              className={`space-y-3 transition-all duration-500 ease-in-out ${
                showContactInfo
                  ? 'opacity-100 max-h-96 transform translate-y-0'
                  : 'opacity-0 max-h-0 overflow-hidden transform -translate-y-2'
              }`}
            >
              {showContactInfo && (
                <div className="space-y-3 p-4 bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl border border-border/30">
                  <div className="space-y-1">
                    {isEditing && <label className="text-xs text-muted-foreground">Phone</label>}
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={businessInfo.phone}
                        onChange={e => handleInputChange('phone', e.target.value)}
                        className="w-full bg-input rounded-md p-2 text-sm"
                        placeholder="Phone"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-chart-2/20 rounded-lg flex items-center justify-center">
                          <Phone className="h-4 w-4 text-chart-2" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{businessInfo.phone}</p>
                          <p className="text-xs text-muted-foreground">Phone</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    {isEditing && <label className="text-xs text-muted-foreground">Email</label>}
                    {isEditing ? (
                      <Input
                        type="email"
                        value={businessInfo.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        className="w-full bg-input rounded-md p-2 text-sm"
                        placeholder="Email"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-chart-3/20 rounded-lg flex items-center justify-center">
                          <Mail className="h-4 w-4 text-chart-3" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{businessInfo.email}</p>
                          <p className="text-xs text-muted-foreground">Email</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {isEditing && <label className="text-xs text-muted-foreground">Address</label>}
                    {isEditing ? (
                      <Input
                        type="text"
                        value={businessInfo.address}
                        onChange={e => handleInputChange('address', e.target.value)}
                        className="w-full bg-input rounded-md p-2 text-sm"
                        placeholder="Address"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-chart-4/20 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-chart-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{businessInfo.address}</p>
                          <p className="text-xs text-muted-foreground">Location</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="max-w-sm mx-auto bg-card border border-border rounded-2xl shadow-2xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold text-card-foreground flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              Everride QR Code
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Scan with your phone to book a ride instantly
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 p-6">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <img
                src={qrCodeUrl}
                alt="Everride QR Code - Enlarged"
                width="256"
                height="256"
                className="rounded-lg"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-base font-medium text-card-foreground">Scan to Book a Ride</p>
              <p className="text-sm text-muted-foreground">Professional chauffeur service in Surrey, BC</p>
            </div>
            <Button 
              onClick={() => setIsQRModalOpen(false)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold transition-all duration-200"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
