import * as THREE from 'three';

// --- Three.js Setup ---
const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent background to blend with CSS color
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// --- Objects ---

// 1. Particle System
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    // Spread particles across a wide area
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Minimalist white material for particles
const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// 2. Wireframe Geometry (e.g. Icosahedron) floating in background
const geoGeometry = new THREE.IcosahedronGeometry(10, 1);
const geoMaterial = new THREE.MeshBasicMaterial({
    color: 0x444444,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const geoMesh = new THREE.Mesh(geoGeometry, geoMaterial);
scene.add(geoMesh);

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Rotate the particle system slightly
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;

    // Rotate the geometric shape
    geoMesh.rotation.x += 0.001;
    geoMesh.rotation.y += 0.001;

    // Subtle breathing effect
    const time = Date.now() * 0.001;
    geoMesh.position.y = Math.sin(time) * 2;

    renderer.render(scene, camera);
}

animate();

// --- Resize Handling ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Mobile Navigation ---
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

if (burger) {
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// --- Scroll Animation Observer ---
// Triggers CSS class 'show' when elements come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            // Optional: Remove class to re-animate when scrolling back up
            // entry.target.classList.remove('show'); 
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden-left, .hidden-right, .hidden-up');
hiddenElements.forEach((el) => observer.observe(el));

// --- Dynamic Movement on Mouse Move (Parallax) ---
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;

    // Move particles subtly based on mouse
    particlesMesh.rotation.y = mouseX * 0.5;
    particlesMesh.rotation.x = mouseY * 0.5;
});

// --- Theme Toggle Logic ---
const lightBtn = document.getElementById('light-btn');
const darkBtn = document.getElementById('dark-btn');
const body = document.body;

// Check LocalStorage
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    enableLightMode();
} else {
    enableDarkMode();
}

lightBtn.addEventListener('click', () => {
    enableLightMode();
});

darkBtn.addEventListener('click', () => {
    enableDarkMode();
});

function enableLightMode() {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    updateThreeJSTheme(true);
    updateActiveButton('light');
}

function enableDarkMode() {
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    updateThreeJSTheme(false);
    updateActiveButton('dark');
}

function updateActiveButton(theme) {
    if (theme === 'light') {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
    } else {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
    }
}

function updateThreeJSTheme(isLight) {
    if (isLight) {
        // Dark particles on light background
        material.color.setHex(0x000000);
        geoMaterial.color.setHex(0xaaaaaa);
    } else {
        // White particles on dark background
        material.color.setHex(0xffffff);
        geoMaterial.color.setHex(0x444444);
    }
}

// --- Visitor Counter (Simulation) ---
const counterElement = document.getElementById('counter');

function updateCounter() {
    // Check if we have a count
    let count = localStorage.getItem('page_views');

    // Initialize or Increment
    if (!count) {
        count = 1000; // Start at a cool number
    } else {
        count = parseInt(count) + 1; // Increment on every load
    }

    localStorage.setItem('page_views', count);

    // Animate the number
    animateValue(counterElement, count - 50, count, 2000);
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}

updateCounter();

// --- Carousel Auto-Scroll (Optional Slow Advance) ---
/* 
const carousel = document.querySelector('.cert-carousel');
if (carousel) {
    let scrollTimeout;
    // Optional: Add listeners if needed for custom behavior
} 
*/

// --- Contact Form Handling ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;

        // Show loading state
        btn.innerText = 'Sending...';
        btn.disabled = true;

        // Simulate sending (replace this with actual Formspree/EmailJS fetch call if desired)
        setTimeout(() => {
            // Success feedback
            btn.innerText = 'Message Sent!';
            btn.style.backgroundColor = '#4CAF50';
            btn.style.borderColor = '#4CAF50';
            btn.style.color = '#fff';

            contactForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 3000);

            alert("Thanks for reaching out! I'll get back to you soon.");
        }, 1500);
    });
}

console.log("Portfolio loaded.");
