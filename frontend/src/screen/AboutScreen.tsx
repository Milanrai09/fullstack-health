
const AboutScreen = () => {
  return (
    <div className="about-container">
      <div className="header">
        <h1>Welcome to HealthHub</h1>
      </div>
      <div className="content">
        <p>HealthHub is your one-stop destination for all things health and wellness. Our mission is to empower individuals to take control of their health by providing a comprehensive platform for nutrition research, educational articles, and expert advice.</p>
        
        <h2>Features:</h2>
        <ul>
          <li>Nutrition Search: Look up detailed nutrition facts and information on various foods and ingredients.</li>
          <li>Article Library: Read informative articles on health and wellness, written by experts in the field.</li>
          <li>Categories: Explore topics across Popular, Mental Health, Diet, Fitness, and Health Lifestyle.</li>
          <li>AI Research Assistant: Get personalized guidance and insights from our cutting-edge AI chat feature.</li>
        </ul>
        
        <h2>Our Vision:</h2>
        <p>At HealthHub, we believe that knowledge is power. We aim to create a community that fosters healthy living, informed decision-making, and supportive connections. Join us on this journey towards a healthier, happier you!</p>
        
        <h2>Meet Our Team:</h2>
        {/* Insert team profiles or descriptions */}
        
        <h2>Get in Touch:</h2>
        <p>Have a question or suggestion? We'd love to hear from you!</p>
        <ul>
          <li>Email: <a href="mailto:support@healthhub.com">support@healthhub.com</a></li>
          <li>Twitter: <a href="https://twitter.com/HealthHubApp" target="_blank">@HealthHubApp</a></li>
        </ul>
        
        <h2>Stay Connected:</h2>
        <p>Follow us on Twitter for the latest health tips, updates, and behind-the-scenes insights into our platform!</p>
        
      </div>
    </div>
  )
}

export default AboutScreen