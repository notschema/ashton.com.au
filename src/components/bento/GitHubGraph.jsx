import { GitHubCalendar } from 'react-github-calendar';

/**
 * GitHubGraph - GitHub contribution calendar for Bento grid
 */

const theme = {
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
};

export default function GitHubGraph({ username = 'notschema' }) {
    return (
        <div className="glass-card h-full p-6 flex flex-col">
            <h3 className="text-sm font-medium text-gray-400 mb-4">GitHub Activity</h3>
            <div className="flex-1 flex items-center justify-center overflow-hidden">
                <GitHubCalendar
                    username={username}
                    theme={theme}
                    colorScheme="dark"
                    fontSize={12}
                    blockSize={12}
                    blockMargin={4}
                    hideColorLegend
                    hideMonthLabels={false}
                    style={{
                        color: '#9ca3af',
                    }}
                />
            </div>
        </div>
    );
}
