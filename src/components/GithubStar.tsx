import GitHubButton from 'react-github-btn';
export default function GithubButton() {
  return (
    <div style={{ marginBottom: -7 }}>
      <GitHubButton
        href="https://github.com/thx/gogocode"
        data-size="large"
        data-show-count="true"
        aria-label="Star thx/gogocode on GitHub"
      >
        Star
      </GitHubButton>
    </div>
  );
}
