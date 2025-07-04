
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Play, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const soundOptions = [
    { label: 'Chime', value: 'chime' },
    { label: 'Alert', value: 'alert' },
    { label: 'Success', value: 'success' },
    { label: 'Complete', value: 'complete' },
    { label: 'Click', value: 'click' },
    { label: 'Error', value: 'error' },
];

const notificationSounds = [
    { id: 'pickup-reminder', label: 'Pickup Reminder', defaultSound: 'chime' },
    { id: 'shift-alert', label: 'Shift Alert', defaultSound: 'alert' },
    { id: 'performance-milestone', label: 'Performance Milestone', defaultSound: 'success' },
    { id: 'trip-complete', label: 'Trip Complete', defaultSound: 'complete' },
    { id: 'booking-confirmation', label: 'Booking Confirmation', defaultSound: 'success' },
    { id: 'button-tap', label: 'Button Tap', defaultSound: 'click' },
    { id: 'error-alert', label: 'Error Alert', defaultSound: 'error' },
    { id: 'success-notification', label: 'Success Notification', defaultSound: 'success' },
];

export function SoundSettings() {
    const [selectedSounds, setSelectedSounds] = useState(() => 
        Object.fromEntries(notificationSounds.map(s => [s.id, s.defaultSound]))
    );

    const handleSoundChange = (id: string, value: string) => {
        setSelectedSounds(prev => ({ ...prev, [id]: value }));
    };
    
    const handleResetAll = () => {
        setSelectedSounds(Object.fromEntries(notificationSounds.map(s => [s.id, s.defaultSound])));
    };

    const playSound = (sound: string) => {
        // In a real app, this would use a library like howler.js
        console.log(`Playing sound: ${sound}`);
        const audio = new Audio(`/sounds/${sound}.mp3`);
        audio.play().catch(e => console.error("Error playing sound:", e));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground font-headline">Sound Customization</h1>
                <Button variant="outline" asChild>
                    <Link href="/settings">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Settings
                    </Link>
                </Button>
            </div>
            <p className="text-muted-foreground">Personalize your audio alerts.</p>
            
            <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <h3 className="font-semibold text-card-foreground">Reset All Sounds</h3>
                            <p className="text-sm text-muted-foreground">Revert all sounds to their original settings.</p>
                        </div>
                    </div>
                    <Button onClick={handleResetAll}>Reset</Button>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Notification Sounds</h2>
                <div className="space-y-2">
                    {notificationSounds.map((sound) => (
                        <div key={sound.id} className="flex items-center justify-between rounded-lg border bg-card p-3">
                             <div>
                                <h4 className="font-medium text-card-foreground">{sound.label}</h4>
                                <p className="text-xs text-muted-foreground">Current: {selectedSounds[sound.id]}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={selectedSounds[sound.id]} onValueChange={(value) => handleSoundChange(sound.id, value)}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {soundOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon" onClick={() => playSound(selectedSounds[sound.id])}>
                                    <Play className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
