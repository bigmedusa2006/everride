
import { DateTime } from 'luxon';

export type ValidationSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  severity: ValidationSeverity;
}

export interface BookingValidationData {
  clientName: string;
  clientPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDate: string;
  scheduledTime: string;
  fare: string;
  notes?: string;
}

export class BookingValidator {
  private static readonly MINIMUM_FARE = 5;
  private static readonly MAXIMUM_FARE = 1000;
  private static readonly MINIMUM_BOOKING_NOTICE_HOURS = 0.5; // 30 minutes
  private static readonly MAXIMUM_BOOKING_DAYS_AHEAD = 365; // 1 year

  private static updateSeverity(currentSeverity: ValidationSeverity, newSeverity: ValidationSeverity): ValidationSeverity {
    const severityLevels: Record<ValidationSeverity, number> = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    };
    
    return severityLevels[newSeverity] > severityLevels[currentSeverity] ? newSeverity : currentSeverity;
  }

  static validateBooking(data: BookingValidationData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let severity: ValidationSeverity = 'low';

    // Validate client name
    const nameValidation = this.validateClientName(data.clientName);
    if (!nameValidation.isValid) {
      errors.push(...nameValidation.errors);
      severity = this.updateSeverity(severity, nameValidation.severity);
    }
    warnings.push(...nameValidation.warnings);

    // Validate phone number
    const phoneValidation = this.validatePhoneNumber(data.clientPhone);
    if (!phoneValidation.isValid) {
      errors.push(...phoneValidation.errors);
      severity = this.updateSeverity(severity, phoneValidation.severity);
    }
    warnings.push(...phoneValidation.warnings);

    // Validate locations
    const locationValidation = this.validateLocations(data.pickupLocation, data.dropoffLocation);
    if (!locationValidation.isValid) {
      errors.push(...locationValidation.errors);
      severity = this.updateSeverity(severity, locationValidation.severity);
    }
    warnings.push(...locationValidation.warnings);

    // Validate date and time
    const dateTimeValidation = this.validateDateTime(data.scheduledDate, data.scheduledTime);
    if (!dateTimeValidation.isValid) {
      errors.push(...dateTimeValidation.errors);
      severity = this.updateSeverity(severity, dateTimeValidation.severity);
    }
    warnings.push(...dateTimeValidation.warnings);

    // Validate fare
    const fareValidation = this.validateFare(data.fare);
    if (!fareValidation.isValid) {
      errors.push(...fareValidation.errors);
      severity = this.updateSeverity(severity, fareValidation.severity);
    }
    warnings.push(...fareValidation.warnings);

    // Business logic validation
    const businessValidation = this.validateBusinessRules(data);
    if (!businessValidation.isValid) {
      errors.push(...businessValidation.errors);
      if (businessValidation.severity === 'high' && severity !== 'critical') severity = 'high';
    }
    warnings.push(...businessValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors: Array.from(new Set(errors)), // Remove duplicates
      warnings: Array.from(new Set(warnings)), // Remove duplicates
      severity
    };
  }

  private static validateClientName(name: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!name || !name.trim()) {
      return {
        isValid: false,
        errors: ['Client name is required'],
        warnings: [],
        severity: 'high'
      };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      errors.push('Client name must be at least 2 characters long');
    }

    if (trimmedName.length > 100) {
      errors.push('Client name is too long (maximum 100 characters)');
    }

    // Check for suspicious patterns
    if (/^\d+$/.test(trimmedName)) {
      errors.push('Client name cannot be only numbers');
    }

    if (!/^[a-zA-Z\s\-'\.]+$/.test(trimmedName)) {
      warnings.push('Client name contains unusual characters');
    }

    // Check for common test names
    const testNames = ['test', 'demo', 'example', 'placeholder'];
    if (testNames.some(test => trimmedName.toLowerCase().includes(test))) {
      warnings.push('Client name appears to be a test entry');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      severity: errors.length > 0 ? 'high' : 'low'
    };
  }

  private static validatePhoneNumber(phone: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!phone || !phone.trim()) {
      return {
        isValid: false,
        errors: ['Phone number is required'],
        warnings: [],
        severity: 'medium'
      };
    }

    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');

    if (cleanPhone.length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    if (cleanPhone.length > 15) {
      errors.push('Phone number is too long');
    }

    if (!/^\d+$/.test(cleanPhone)) {
      errors.push('Phone number can only contain digits, spaces, dashes, parentheses, and plus sign');
    }

    // Check for obviously fake numbers
    const fakePatterns = [
      /^(\d)\1{9,}$/, // All same digits
      /^1{10,}$/, // All ones
      /^0{10,}$/, // All zeros
      /^1234567890$/, // Sequential
    ];

    if (fakePatterns.some(pattern => pattern.test(cleanPhone))) {
      warnings.push('Phone number appears to be fake or test data');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      severity: errors.length > 0 ? 'medium' : 'low'
    };
  }

  private static validateLocations(pickup: string, dropoff: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!pickup || !pickup.trim()) {
      errors.push('Pickup location is required');
    }

    if (!dropoff || !dropoff.trim()) {
      errors.push('Destination is required');
    }

    if (pickup && dropoff) {
      const normalizedPickup = pickup.toLowerCase().trim();
      const normalizedDropoff = dropoff.toLowerCase().trim();

      if (normalizedPickup === normalizedDropoff) {
        errors.push('Pickup and destination cannot be the same');
      }

      // Check for minimum address length
      if (pickup.trim().length < 5) {
        warnings.push('Pickup location seems incomplete');
      }

      if (dropoff.trim().length < 5) {
        warnings.push('Destination seems incomplete');
      }

      // Check for Vancouver area locations
      const vancouverKeywords = ['vancouver', 'burnaby', 'richmond', 'surrey', 'coquitlam', 'yvr', 'airport'];
      const pickupInVancouver = vancouverKeywords.some(keyword => normalizedPickup.includes(keyword));
      const dropoffInVancouver = vancouverKeywords.some(keyword => normalizedDropoff.includes(keyword));

      if (!pickupInVancouver && !dropoffInVancouver) {
        warnings.push('Trip appears to be outside the Vancouver area');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      severity: errors.length > 0 ? 'high' : 'low'
    };
  }

  private static validateDateTime(date: string, time: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!date) {
      errors.push('Date is required');
    }

    if (!time) {
      errors.push('Time is required');
    }

    if (!date || !time) {
      return {
        isValid: false,
        errors,
        warnings,
        severity: 'critical'
      };
    }

    try {
      // Parse time in 12-hour format (e.g., "5:30 PM") and combine with date
      const parsedTime = DateTime.fromFormat(time, "h:mm a", { zone: 'America/Vancouver' });
      if (!parsedTime.isValid) {
          errors.push('Invalid time format. Please use HH:MM AM/PM.');
          return { isValid: false, errors, warnings, severity: 'critical' };
      }

      const vancouverTime = DateTime.fromISO(date, { zone: 'America/Vancouver' })
          .set({
              hour: parsedTime.hour,
              minute: parsedTime.minute,
          });

      const now = DateTime.now().setZone('America/Vancouver');

      if (!vancouverTime.isValid) {
        errors.push('Invalid date or time format');
        return {
          isValid: false,
          errors,
          warnings,
          severity: 'critical'
        };
      }

      // Check if booking is in the past
      if (vancouverTime < now) {
        errors.push('Cannot schedule bookings in the past');
      }

      // Check minimum notice period
      const hoursUntilBooking = vancouverTime.diff(now, 'hours').hours;
      if (hoursUntilBooking < this.MINIMUM_BOOKING_NOTICE_HOURS) {
        warnings.push(`Booking is scheduled with less than ${this.MINIMUM_BOOKING_NOTICE_HOURS * 60} minutes notice`);
      }

      // Check maximum advance booking
      const daysUntilBooking = vancouverTime.diff(now, 'days').days;
      if (daysUntilBooking > this.MAXIMUM_BOOKING_DAYS_AHEAD) {
        warnings.push('Booking is scheduled very far in advance');
      }

      // Check business hours
      const hour = vancouverTime.hour;
      if (hour < 6 || hour > 22) {
        warnings.push('Booking is scheduled outside typical business hours (6 AM - 10 PM)');
      }

      // Check for holidays/weekends (basic check)
      if (vancouverTime.weekday > 5) {
        warnings.push('Booking is scheduled for a weekend');
      }

    } catch (error) {
      errors.push('Failed to validate date and time');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      severity: errors.length > 0 ? 'critical' : 'low'
    };
  }

  private static validateFare(fare: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!fare || !fare.trim()) {
      return {
        isValid: false,
        errors: ['Fare amount is required'],
        warnings: [],
        severity: 'medium'
      };
    }

    const fareValue = parseFloat(fare);

    if (isNaN(fareValue)) {
      errors.push('Fare must be a valid number');
    } else {
      if (fareValue <= 0) {
        errors.push('Fare must be greater than zero');
      }

      if (fareValue < this.MINIMUM_FARE) {
        errors.push(`Minimum fare is $${this.MINIMUM_FARE}`);
      }

      if (fareValue > this.MAXIMUM_FARE) {
        warnings.push(`Fare amount ($${fareValue}) is unusually high`);
      }

      // Check for common fare ranges in Vancouver
      if (fareValue < 10) {
        warnings.push('Fare seems low for Vancouver taxi service');
      }

      if (fareValue > 200) {
        warnings.push('Fare seems high - please verify with customer');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      severity: errors.length > 0 ? 'medium' : 'low'
    };
  }

  private static validateBusinessRules(data: BookingValidationData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate business logic combinations
    if (data.pickupLocation && data.dropoffLocation && data.fare) {
      const fareValue = parseFloat(data.fare);
      
      // Airport trips should typically be higher fare
      const isAirportTrip = 
        data.pickupLocation.toLowerCase().includes('airport') || 
        data.dropoffLocation.toLowerCase().includes('airport') ||
        data.pickupLocation.toLowerCase().includes('yvr') || 
        data.dropoffLocation.toLowerCase().includes('yvr');

      if (isAirportTrip && fareValue < 50) {
        warnings.push('Airport trips typically cost more than $50');
      }

      // Downtown trips validation
      const isDowntownTrip = 
        data.pickupLocation.toLowerCase().includes('downtown') || 
        data.dropoffLocation.toLowerCase().includes('downtown');

      if (isDowntownTrip && fareValue > 100) {
        warnings.push('Downtown trips typically cost less than $100');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      severity: errors.length > 0 ? 'high' : 'low'
    };
  }

  static validateField(fieldName: keyof BookingValidationData, value: string, context?: Partial<BookingValidationData>): ValidationResult {
    const mockData: BookingValidationData = {
      clientName: '',
      clientPhone: '',
      pickupLocation: '',
      dropoffLocation: '',
      scheduledDate: '',
      scheduledTime: '',
      fare: '',
      notes: '',
      ...context,
      [fieldName]: value
    };

    const fullValidation = this.validateBooking(mockData);
    
    // Filter results to only include errors/warnings related to the specific field
    const fieldErrors = fullValidation.errors.filter(error => 
      this.isErrorRelatedToField(error, fieldName)
    );
    
    const fieldWarnings = fullValidation.warnings.filter(warning => 
      this.isWarningRelatedToField(warning, fieldName)
    );

    return {
      isValid: fieldErrors.length === 0,
      errors: fieldErrors,
      warnings: fieldWarnings,
      severity: fieldErrors.length > 0 ? fullValidation.severity : 'low'
    };
  }

  private static isErrorRelatedToField(error: string, fieldName: string): boolean {
    const fieldMappings: Record<string, string[]> = {
      clientName: ['client name', 'name'],
      clientPhone: ['phone', 'number'],
      pickupLocation: ['pickup', 'pickup location'],
      dropoffLocation: ['destination', 'dropoff', 'same'],
      scheduledDate: ['date'],
      scheduledTime: ['time'],
      fare: ['fare', 'amount']
    };

    const keywords = fieldMappings[fieldName] || [];
    return keywords.some(keyword => error.toLowerCase().includes(keyword));
  }

  private static isWarningRelatedToField(warning: string, fieldName: string): boolean {
    return this.isErrorRelatedToField(warning, fieldName);
  }
}
