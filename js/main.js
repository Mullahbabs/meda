(function ($) {
    "use strict";
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });

    
    // Main carousel
    $(".carousel .owl-carousel").owlCarousel({
        autoplay: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        smartSpeed: 300,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ]
    });
    
    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });
    
    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        autoplay: true,
        animateIn: 'slideInDown',
        animateOut: 'slideOutDown',
        items: 1,
        smartSpeed: 450,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
    
    // Blogs carousel
    $(".blog-carousel").owlCarousel({
        autoplay: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    new WOW().init();

    document.querySelector('.add-member-btn').addEventListener('click', function() {
        const container = document.getElementById('memberContainer');
        const count = container.children.length + 1;
        
        const div = document.createElement('div');
        div.className = 'member-input';
        div.innerHTML = `
            <input type="text" placeholder="Member ${count} Full Name" required>
            <input type="tel" placeholder="Phone Number" required>
        `;
        
        container.appendChild(div);
    });

    // Form Validation Class
    class FormValidator {
    constructor(formId) {
      this.form = document.getElementById(formId);
      this.inputs = this.form.querySelectorAll('input, select, textarea');
      this.init();
    }
  
    init() {
      this.form.addEventListener('submit', (e) => this.validateForm(e));
      
      // Add real-time validation
      this.inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        if (input.type === 'file') {
          input.addEventListener('change', () => this.validateFile(input));
        }
      });
    }
  
    validateForm(e) {
      e.preventDefault();
      let isValid = true;
  
      this.inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });
  
      if (isValid) {
        this.showSuccessMessage();
        // In real app: form.submit();
      } else {
        this.showErrorToast();
      }
    }
  
    validateField(input) {
      const value = input.value.trim();
      const parent = input.closest('.input-group');
      const errorElement = parent.querySelector('.error-message') || this.createErrorElement(parent);
  
      // Clear previous error
      errorElement.textContent = '';
      parent.classList.remove('error');
  
      // Required validation
      if (input.required && !value) {
        errorElement.textContent = 'This field is required';
        parent.classList.add('error');
        return false;
      }
  
      // Email validation
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorElement.textContent = 'Please enter a valid email';
        parent.classList.add('error');
        return false;
      }
  
      // Number validation
      if (input.type === 'number' && input.min && parseFloat(value) < parseFloat(input.min)) {
        errorElement.textContent = `Minimum value is ${input.min}`;
        parent.classList.add('error');
        return false;
      }
  
      return true;
    }
  
    validateFile(input) {
      const parent = input.closest('.file-upload-group') || input.closest('.input-group');
      const errorElement = parent.querySelector('.error-message') || this.createErrorElement(parent);
      
      if (input.required && input.files.length === 0) {
        errorElement.textContent = 'Please upload required files';
        parent.classList.add('error');
        return false;
      }
      return true;
    }
  
    createErrorElement(parent) {
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      parent.appendChild(errorElement);
      return errorElement;
    }
  
    showSuccessMessage() {
      const successToast = document.createElement('div');
      successToast.className = 'form-toast success';
      successToast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Form submitted successfully!</span>
      `;
      document.body.appendChild(successToast);
      setTimeout(() => successToast.remove(), 3000);
    }
  
    showErrorToast() {
      const errorToast = document.createElement('div');
      errorToast.className = 'form-toast error';
      errorToast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>Please fix the errors in the form</span>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => errorToast.remove(), 3000);
      
      // Scroll to first error
      const firstError = this.form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  
  // Initialize for all forms
  new FormValidator('boiForm');
  new FormValidator('boaForm');
  new FormValidator('edcForm');
  new FormValidator('medaForm');


  class MultiStepForm {
    constructor() {
      this.currentStep = 1;
      this.totalSteps = 3;
      this.form = document.getElementById('edcForm');
      this.init();
    }
  
    init() {
      this.showStep(1);
      this.form.querySelector('.next-step').addEventListener('click', (e) => {
        e.preventDefault();
        this.nextStep();
      });
      
      this.form.querySelector('.prev-step').addEventListener('click', (e) => {
        e.preventDefault();
        this.prevStep();
      });
    }
  
    nextStep() {
      if (this.validateStep(this.currentStep)) {
        this.currentStep++;
        this.showStep(this.currentStep);
        this.updateProgress();
      }
    }
  
    prevStep() {
      this.currentStep--;
      this.showStep(this.currentStep);
      this.updateProgress();
    }
  
    showStep(stepNumber) {
      // Hide all steps
      document.querySelectorAll('.form-step').forEach(step => {
        step.style.display = 'none';
      });
      
      // Show current step
      document.getElementById(`step${stepNumber}`).style.display = 'block';
      
      // Update button visibility
      document.querySelector('.prev-step').style.display = stepNumber === 1 ? 'none' : 'block';
      document.querySelector('.next-step').style.display = stepNumber === this.totalSteps ? 'none' : 'block';
      document.querySelector('.submit-btn').style.display = stepNumber === this.totalSteps ? 'block' : 'none';
    }
  
    updateProgress() {
      document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
        if (index + 1 < this.currentStep) {
          step.classList.add('completed');
          step.classList.remove('active');
        } else if (index + 1 === this.currentStep) {
          step.classList.add('active');
          step.classList.remove('completed');
        } else {
          step.classList.remove('active', 'completed');
        }
      });
    }
  
    validateStep(step) {
      let isValid = true;
      const stepElement = document.getElementById(`step${step}`);
      
      stepElement.querySelectorAll('input, select, textarea').forEach(input => {
        if (input.required && !input.value.trim()) {
          isValid = false;
          const parent = input.closest('.input-group');
          parent.classList.add('error');
          
          if (!parent.querySelector('.error-message')) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = 'This field is required';
            parent.appendChild(errorElement);
          }
        }
      });
  
      if (!isValid) {
        stepElement.scrollIntoView({ behavior: 'smooth' });
      }
  
      return isValid;
    }
  }
  
  // Initialize
  new MultiStepForm();

  class RepaymentCalculator {
    constructor() {
      this.amountInput = document.getElementById('loanAmount');
      this.periodSelect = document.getElementById('repaymentPeriod');
      this.resultElement = document.getElementById('repaymentResult');
      this.init();
    }
  
    init() {
      this.amountInput.addEventListener('input', () => this.calculate());
      this.periodSelect.addEventListener('change', () => this.calculate());
      this.calculate(); // Initial calculation
    }
  
    calculate() {
      const amount = parseFloat(this.amountInput.value) || 0;
      const period = parseInt(this.periodSelect.value) || 3;
      const interestRate = 0.05; // 5% monthly interest
      
      if (amount <= 0) {
        this.resultElement.innerHTML = '';
        return;
      }
  
      const totalInterest = amount * interestRate * period;
      const totalRepayment = amount + totalInterest;
      const monthlyPayment = totalRepayment / period;
  
      this.resultElement.innerHTML = `
        <div class="calculation-row">
          <span>Principal:</span>
          <span>₦${amount.toLocaleString()}</span>
        </div>
        <div class="calculation-row">
          <span>Total Interest (${period} months):</span>
          <span>₦${totalInterest.toLocaleString()}</span>
        </div>
        <div class="calculation-row highlight">
          <span>Monthly Payment:</span>
          <span>₦${monthlyPayment.toLocaleString()}</span>
        </div>
        <div class="calculation-row total">
          <span>Total Repayment:</span>
          <span>₦${totalRepayment.toLocaleString()}</span>
        </div>
      `;
    }
  }
  
  // Initialize when MEDA form exists
  if (document.getElementById('loanAmount')) {
    new RepaymentCalculator();
  }

  // Auto-fill sample data function
   function fillSampleData(formId) {
    const samples = {
      boiForm: {
        'businessName': 'Prime Industrial Solutions',
        'cacNumber': 'RC78945612',
        'yearsOperation': '4-5 years',
        'loanAmount': '25000000',
        'industrySector': 'Manufacturing',
        'collateralType': 'Real Estate',
        'businessPlan': 'We manufacture eco-friendly packaging materials with 5 years projected 20% annual growth...'
      },
      boaForm: {
        'farmName': 'Green Fields Agro',
        'farmLocation': 'Oyo State, Ibadan',
        'farmSize': '12',
        'primaryActivity': 'Crop Production',
        'employees': '8',
        'landOwnership': 'Owned',
        'productionPlan': 'We cultivate maize and cassava on 12 hectares with irrigation...'
      },
      edcForm: {
        'startupName': 'TechFarm Innovations',
        'edcBatch': 'EDC-2023-15',
        'businessStage': 'Early Revenue',
        'innovationArea': 'Technology',
        'innovationDesc': 'Our mobile app connects small farmers with buyers directly...',
        'monthlyRevenue': '450000',
        'fundingSought': '5000000'
      },
      medaForm: {
        'fullName': 'Amina Mohammed',
        'businessType': 'Retail',
        'dailySales': '15000',
        'businessAddress': 'No. 12 Market Road, Kano',
        'loanAmount': '300000',
        'repaymentPeriod': '6'
      }
    };
  
    const form = document.getElementById(formId);
    const data = samples[formId];
  
    for (const [name, value] of Object.entries(data)) {
      const input = form.querySelector(`[name="${name}"]`) || 
                   form.querySelector(`[placeholder*="${name}"]`);
      
      if (input) {
        if (input.tagName === 'SELECT') {
          const option = Array.from(input.options).find(opt => 
            opt.text.includes(value) || opt.value === value
          );
          if (option) option.selected = true;
        } else {
          input.value = value;
        }
      }
    }
  }
  
  // Add sample buttons to each form
  function addSampleButtons() {
    const forms = [
      { id: 'boiForm', name: 'BOI' },
      { id: 'boaForm', name: 'BOA' },
      { id: 'edcForm', name: 'EDC' },
      { id: 'medaForm', name: 'MEDA' }
    ];
  
    forms.forEach(form => {
      const formElement = document.getElementById(form.id);
      if (formElement) {
        const sampleBtn = document.createElement('button');
        sampleBtn.type = 'button';
        sampleBtn.className = 'sample-btn';
        sampleBtn.innerHTML = `<i class="fas fa-magic"></i> Load Sample Data`;
        sampleBtn.onclick = () => fillSampleData(form.id);
        
        formElement.insertBefore(sampleBtn, formElement.firstChild);
      }
    });
  }
  
  // Run when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    addSampleButtons();
    
    // Initialize calculator if on MEDA form
    if (document.getElementById('loanAmount')) {
      new RepaymentCalculator();
    }
  });

    
    

    
    
})(jQuery);

