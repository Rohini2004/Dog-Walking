// Function to create blog posts with detailed content
function createDetailedBlogPosts() {
    const blogPosts = [
        {
            title: "Why Daily Walks Keep Your Dog Happy and Healthy",
            content: `
                <p>Regular exercise through daily walks is crucial for maintaining your dog's physical and mental well-being. Dogs are naturally active animals that need consistent physical activity to stay healthy and balanced.</p>
                
                <h3>Physical Benefits</h3>
                <ul>
                    <li>Helps maintain a healthy weight</li>
                    <li>Improves cardiovascular health</li>
                    <li>Strengthens muscles and joints</li>
                    <li>Aids in digestion</li>
                </ul>

                <h3>Mental Benefits</h3>
                <ul>
                    <li>Reduces anxiety and stress</li>
                    <li>Provides mental stimulation</li>
                    <li>Prevents destructive behavior</li>
                    <li>Improves sleep quality</li>
                </ul>
            `
        },
        {
            title: "Tips for Making Every Dog Walk More Enjoyable",
            content: `
                <p>Transform your daily dog walks from a routine task into an engaging adventure for both you and your furry friend with these expert tips.</p>

                <h3>Essential Walking Tips</h3>
                <ul>
                    <li>Vary your walking routes to keep things interesting</li>
                    <li>Allow time for sniffing and exploration</li>
                    <li>Bring water and treats for positive reinforcement</li>
                    <li>Use proper walking equipment</li>
                </ul>

                <h3>Training Opportunities</h3>
                <ul>
                    <li>Practice basic commands during walks</li>
                    <li>Work on leash manners</li>
                    <li>Socialize with other dogs safely</li>
                    <li>Build confidence in different environments</li>
                </ul>
            `
        },
        {
            title: "Building Strong Bonds Through Regular Walking",
            content: `
                <p>Walking together is one of the most effective ways to strengthen the bond between you and your dog. It's not just about exercise—it's about creating shared experiences and trust.</p>

                <h3>Bonding Benefits</h3>
                <ul>
                    <li>Creates quality one-on-one time</li>
                    <li>Establishes trust and leadership</li>
                    <li>Develops better communication</li>
                    <li>Creates lasting memories</li>
                </ul>

                <h3>Communication Tips</h3>
                <ul>
                    <li>Use consistent commands</li>
                    <li>Pay attention to your dog's body language</li>
                    <li>Reward good behavior</li>
                    <li>Make walking time special</li>
                </ul>
            `
        }
    ];

    const blogSection = document.getElementById('detailed-blog-content');
    if (!blogSection) return;

    blogPosts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-article';
        article.innerHTML = `
            <h2>${post.title}</h2>
            <div class="article-content">
                ${post.content}
            </div>
        `;
        blogSection.appendChild(article);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', createDetailedBlogPosts);