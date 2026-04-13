// Enhanced Form Validation System
class FormValidator {
    constructor() {
        this.errors = {};
        this.rules = {
            required: (value) => value && value.toString().trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value),
            aadhar: (value) => /^[0-9\s]{12,14}$/.test(value.replace(/\s/g, '')),
            minLength: (value, min) => value && value.length >= min,
            maxLength: (value, max) => value && value.length <= max,
            number: (value) => !isNaN(value) && value > 0,
            date: (value) => !isNaN(Date.parse(value)),
            futureDate: (value) => new Date(value) > new Date()
        };
    }

    // Validate single field
    validateField(fieldName, value, rules) {
        const errors = [];
        
        for (const rule of rules) {
            if (typeof rule === 'string') {
                if (!this.rules[rule](value)) {
                    errors.push(this.getErrorMessage(rule, fieldName));
                }
            } else if (typeof rule === 'object') {
                const [ruleName, param] = Object.entries(rule)[0];
                if (!this.rules[ruleName](value, param)) {
                    errors.push(this.getErrorMessage(ruleName, fieldName, param));
                }
            }
        }
        
        return errors;
    }

    // Get error message
    getErrorMessage(rule, fieldName, param) {
        const messages = {
            required: `${fieldName} is required`,
            email: `Please enter a valid email address`,
            phone: `Please enter a valid phone number`,
            aadhar: `Please enter a valid Aadhar number`,
            minLength: `${fieldName} must be at least ${param} characters`,
            maxLength: `${fieldName} must not exceed ${param} characters`,
            number: `Please enter a valid number`,
            date: `Please enter a valid date`,
            futureDate: `Date must be in the future`
        };
        return messages[rule] || `Invalid ${fieldName}`;
    }

    // Validate entire form
    validateForm() {
        this.errors = {};
        let isValid = true;

        // Client Details Validation
        const brideNameErrors = this.validateField('Bride Name', 
            document.querySelector('input[name="bride_name"]')?.value, ['required']);
        if (brideNameErrors.length) {
            this.errors.bride_name = brideNameErrors;
            isValid = false;
        }

        const groomNameErrors = this.validateField('Groom Name', 
            document.querySelector('input[name="groom_name"]')?.value, ['required']);
        if (groomNameErrors.length) {
            this.errors.groom_name = groomNameErrors;
            isValid = false;
        }

        // Aadhar validation
        const brideAadhar = document.querySelector('input[name="bride_aadhar"]')?.value;
        if (brideAadhar) {
            const brideAadharErrors = this.validateField('Bride Aadhar', brideAadhar, ['aadhar']);
            if (brideAadharErrors.length) {
                this.errors.bride_aadhar = brideAadharErrors;
                isValid = false;
            }
        }

        const groomAadhar = document.querySelector('input[name="groom_aadhar"]')?.value;
        if (groomAadhar) {
            const groomAadharErrors = this.validateField('Groom Aadhar', groomAadhar, ['aadhar']);
            if (groomAadharErrors.length) {
                this.errors.groom_aadhar = groomAadharErrors;
                isValid = false;
            }
        }

        // Email validation
        const brideEmail = document.querySelector('input[name="bride_email"]')?.value;
        if (brideEmail) {
            const brideEmailErrors = this.validateField('Bride Email', brideEmail, ['email']);
            if (brideEmailErrors.length) {
                this.errors.bride_email = brideEmailErrors;
                isValid = false;
            }
        }

        const groomEmail = document.querySelector('input[name="groom_email"]')?.value;
        if (groomEmail) {
            const groomEmailErrors = this.validateField('Groom Email', groomEmail, ['email']);
            if (groomEmailErrors.length) {
                this.errors.groom_email = groomEmailErrors;
                isValid = false;
            }
        }

        // Phone validation
        const brideContact = document.querySelector('input[name="bride_contact"]')?.value;
        if (brideContact) {
            const brideContactErrors = this.validateField('Bride Contact', brideContact, ['phone']);
            if (brideContactErrors.length) {
                this.errors.bride_contact = brideContactErrors;
                isValid = false;
            }
        }

        const groomContact = document.querySelector('input[name="groom_contact"]')?.value;
        if (groomContact) {
            const groomContactErrors = this.validateField('Groom Contact', groomContact, ['phone']);
            if (groomContactErrors.length) {
                this.errors.groom_contact = groomContactErrors;
                isValid = false;
            }
        }

        // Coverage type validation
        const coverageType = document.querySelector('select[name="coverage_type"]')?.value;
        if (!coverageType) {
            this.errors.coverage_type = ['Coverage type is required'];
            isValid = false;
        }

        // Event validation
        const eventBoxes = document.querySelectorAll('.event-box');
        eventBoxes.forEach((box, index) => {
            const eventName = box.querySelector('select[name="event_name[]"]')?.value;
            const eventDate = box.querySelector('input[name="event_date[]"]')?.value;
            const coverage = box.querySelector('select[name="coverage[]"]')?.value;

            if (!eventName) {
                this.errors[`event_${index}_name`] = ['Event name is required'];
                isValid = false;
            }
            if (!eventDate) {
                this.errors[`event_${index}_date`] = ['Event date is required'];
                isValid = false;
            }
            if (!coverage) {
                this.errors[`event_${index}_coverage`] = ['Coverage is required'];
                isValid = false;
            }
        });

        return isValid;
    }

    // Show validation errors
    showErrors() {
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500');
            el.classList.add('border-gray-300');
        });

        // Show new errors
        Object.keys(this.errors).forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`) || 
                         document.querySelector(`[name="${fieldName}[]"]`);
            
            if (field) {
                // Highlight field
                field.classList.remove('border-gray-300');
                field.classList.add('border-red-500');

                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message text-red-500 text-xs mt-1';
                errorDiv.textContent = this.errors[fieldName][0];
                field.parentNode.appendChild(errorDiv);
            }
        });

        // Show error summary
        if (Object.keys(this.errors).length > 0) {
            this.showErrorSummary();
        }
    }

    // Show error summary
    showErrorSummary() {
        const errorCount = Object.keys(this.errors).length;
        showCustomAlert(
            `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before proceeding`,
            'error',
            'Validation Error'
        );
    }

    // Real-time validation
    setupRealTimeValidation() {
        // Add event listeners for real-time validation
        const fields = [
            'bride_name', 'groom_name', 'bride_aadhar', 'groom_aadhar',
            'bride_email', 'groom_email', 'bride_contact', 'groom_contact'
        ];

        fields.forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateSingleField(fieldName, field);
                });
                field.addEventListener('input', () => {
                    this.clearFieldError(fieldName, field);
                });
            }
        });
    }

    // Validate single field on blur
    validateSingleField(fieldName, field) {
        const value = field.value;
        let rules = [];

        // Define rules based on field
        if (fieldName.includes('name')) rules = ['required'];
        if (fieldName.includes('aadhar') && value) rules = ['aadhar'];
        if (fieldName.includes('email') && value) rules = ['email'];
        if (fieldName.includes('contact') && value) rules = ['phone'];

        const errors = this.validateField(fieldName.replace('_', ' '), value, rules);
        
        if (errors.length > 0) {
            this.showFieldError(fieldName, field, errors[0]);
        } else {
            this.clearFieldError(fieldName, field);
        }
    }

    // Show field error
    showFieldError(fieldName, field, message) {
        this.clearFieldError(fieldName, field);
        
        field.classList.remove('border-gray-300');
        field.classList.add('border-red-500');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-xs mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    clearFieldError(fieldName, field) {
        field.classList.remove('border-red-500');
        field.classList.add('border-gray-300');
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
}

// Create global validator instance
window.formValidator = new FormValidator();