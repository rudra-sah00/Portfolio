'use client';

import { useEffect, useState } from 'react';
import { GitHubRepo } from '@/types';
import { fetchGitHubRepositories } from '@/lib/api';
import Hero from '@/components/Hero';
import ProjectsSection from '@/components/ProjectsSection';
import Footer from '@/components/Footer';

export default function Home() {
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔧 Change this to any GitHub username to fetch their public repositories
  const username = 'rudra-sah00'; // Try: 'octocat', 'torvalds', 'gaearon', etc.

  // Fetch repositories and their README files
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const repos = await fetchGitHubRepositories(username);
        setRepositories(repos);
        // Add a small delay to show loading animation
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading repositories:', error);
        setLoading(false);
      }
    };

    loadRepositories();
  }, [username]);

  return (
    <main>
      <Hero repositories={repositories} loading={loading} />
      <ProjectsSection repositories={repositories} loading={loading} />
      <Footer />
    </main>
  );
}
