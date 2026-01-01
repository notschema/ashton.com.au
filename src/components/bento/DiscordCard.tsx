import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import { FaDiscord } from 'react-icons/fa'

const DISCORD_USER_ID = '169372933913968649'
const LANYARD_WS_URL = 'wss://api.lanyard.rest/socket'
const LANYARD_REST_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`

interface LanyardUser {
    discord_user: {
        id: string
        username: string
        avatar: string
        global_name: string | null
    }
    discord_status: 'online' | 'idle' | 'dnd' | 'offline'
    activities: Activity[]
}

interface Activity {
    type: number
    name: string
    details?: string
    state?: string
    application_id?: string
    assets?: {
        large_image?: string
        small_image?: string
    }
    timestamps?: {
        start?: number
    }
}

const getAvatarUrl = (userId: string, avatarHash: string) => {
    if (!avatarHash) return `https://cdn.discordapp.com/embed/avatars/0.png`
    const ext = avatarHash.startsWith('a_') ? 'gif' : 'png'
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=128`
}

const getElapsedTime = (startTime: number): string => {
    const now = Date.now()
    const diff = now - startTime
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} elapsed`
}

// Status indicator matching original design
const StatusIndicator = memo<{ status: LanyardUser['discord_status'] }>(({ status }) => {
    const configs = {
        online: { bg: 'bg-primary', indicator: null },
        idle: { bg: 'bg-primary', indicator: <div className="bg-background size-[10px] rounded-full" /> },
        dnd: { bg: 'bg-destructive', indicator: <div className="bg-background h-[4px] w-[11px] rounded-full" /> },
        offline: { bg: 'bg-muted-foreground', indicator: <div className="bg-background size-2 rounded-full" /> },
    }

    const config = configs[status]

    return (
        <div className={`ring-muted absolute right-1 bottom-1 size-4 rounded-full ring-6 ${config.bg} ${config.indicator ? 'flex items-center justify-center' : ''}`}>
            {config.indicator}
        </div>
    )
})

// Decorative badges matching original design
const DecorativeBadges = memo(() => {
    const badgeStyles = [
        'grayscale size-3 rounded-full bg-purple-200/75 sepia-50',
        'grayscale size-3 bg-violet-200/75 sepia-50 rounded-xs',
        'grayscale size-3 rounded-xs bg-emerald-200/75 sepia-50',
        'grayscale size-3 bg-fuchsia-200/75 sepia-50',
        'grayscale size-3 rounded-full bg-teal-200/75 sepia-50',
        'grayscale size-3 rounded-full bg-transparent ring-2 ring-sky-200/75 sepia-50 ring-inset',
    ]

    const clipPaths = [
        undefined,
        'polygon(50% 100%, 100% 50%, 100% 0%, 0% 0%, 0% 50%)',
        undefined,
        'polygon(50% 0%, 85% 0%, 100% 35%, 85% 55%, 50% 100%, 15% 55%, 0% 35%, 15% 0%)',
        undefined,
        undefined,
    ]

    return (
        <div className="bg-border/50 flex items-center gap-1.5 px-2">
            {badgeStyles.map((style, index) => (
                <div
                    key={index}
                    className={style}
                    style={clipPaths[index] ? { clipPath: clipPaths[index] } : undefined}
                />
            ))}
        </div>
    )
})

// User info section
const UserInfo = memo(() => (
    <div className="bg-border/50 flex flex-col gap-y-1 p-3">
        <span className="text-base leading-none">imschema</span>
        <span className="text-muted-foreground text-xs leading-none">@imschema</span>
    </div>
))

// Discord logo in corner
const DiscordLogo = memo(() => (
    <div className="bg-primary absolute top-0 right-0 m-3 flex size-14 items-center justify-center rounded-full">
        <FaDiscord className="text-background size-10" />
    </div>
))

// Activity display with fallback placeholder
const ActivityDisplay = memo<{ activity: Activity | null; elapsed: string }>(({ activity, elapsed }) => {
    const activityImageUrl = useMemo(() => {
        if (!activity?.assets?.large_image || !activity.application_id) {
            return '/static/bento/bento-discord-futon.svg'
        }
        if (activity.assets.large_image.startsWith('mp:')) {
            return `https://media.discordapp.net/${activity.assets.large_image.slice(3)}`
        }
        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
    }, [activity?.assets?.large_image, activity?.application_id])

    const smallImageUrl = useMemo(() => {
        if (!activity?.assets?.small_image || !activity.application_id) return null
        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`
    }, [activity?.assets?.small_image, activity?.application_id])

    // Fallback content when no activity
    const displayActivity = activity || {
        name: 'No status',
        details: "I'm probably sleeping...",
        state: 'Enjoy your stay!',
    }

    const displayElapsedTime = elapsed || '∞:00 elapsed'

    return (
        <div className="flex size-full items-center gap-x-2 sm:gap-x-3">
            <div className="relative aspect-square h-full max-h-12 shrink-0 sm:max-h-16">
                <div
                    style={{ backgroundImage: `url('${activityImageUrl}')` }}
                    className="absolute inset-0 bg-contain bg-center bg-no-repeat grayscale sepia-50"
                />
                {smallImageUrl && (
                    <div className="absolute -right-1 -bottom-1 overflow-hidden rounded-full border-2 border-[#1a1917] sm:-right-2 sm:-bottom-2 sm:border-4">
                        <img
                            src={smallImageUrl}
                            alt="Application Icon"
                            width={16}
                            height={16}
                            className="grayscale sepia-50 sm:h-6 sm:w-6"
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-y-1 py-1">
                {displayActivity.name && (
                    <div className="mb-0.5 line-clamp-1 text-xs leading-none">
                        {displayActivity.name}
                    </div>
                )}
                {displayActivity.details && (
                    <div className="text-muted-foreground line-clamp-2 text-[11px] leading-none">
                        {displayActivity.details}
                    </div>
                )}
                {displayActivity.state && (
                    <div className="text-muted-foreground line-clamp-1 text-[11px] leading-none">
                        {displayActivity.state}
                    </div>
                )}
                {displayElapsedTime && (
                    <div className="text-muted-foreground text-[11px] leading-none">
                        {displayElapsedTime}
                    </div>
                )}
            </div>
        </div>
    )
})

// Avatar section with real Discord avatar
const AvatarSection = memo<{ avatarUrl: string; status: LanyardUser['discord_status'] }>(
    ({ avatarUrl, status }) => (
        <div className="flex justify-between gap-x-1">
            <div className="relative">
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="-mt-12 aspect-square size-16 rounded-full grayscale sepia-50 sm:-mt-[4.5rem] sm:size-24"
                />
                <StatusIndicator status={status} />
            </div>
            <DecorativeBadges />
        </div>
    )
)

// Main layout component
const DiscordLayout = memo<{
    avatarUrl: string
    status: LanyardUser['discord_status']
    activityContent: React.ReactNode
}>(({ avatarUrl, status, activityContent }) => (
    <div data-trigger className="group/discord relative size-full overflow-hidden">
        <p className="text-foreground/80 bg-muted absolute top-4 left-30 hidden border p-2 text-xs opacity-0 transition-opacity duration-200 group-hover/discord:opacity-100 sm:block">
            Feel free
            <br />
            to add me!
        </p>
        <div className="grid size-full grid-rows-4">
            <div className="bg-border/25 bg-[url('/static/bento/discord-banner.png')] bg-cover bg-center bg-no-repeat" />
            <div className="bg-muted row-span-3 flex flex-col gap-3 p-3">
                <AvatarSection avatarUrl={avatarUrl} status={status} />
                <UserInfo />
                <div className="bg-border/50 flex-1 p-3">{activityContent}</div>
            </div>
        </div>
        <DiscordLogo />
    </div>
))

// Loading skeleton
const LoadingSkeleton = memo(() => (
    <div className="size-full flex items-center justify-center bg-muted">
        <div className="size-8 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin" />
    </div>
))

// Main component
const DiscordCard = () => {
    const [user, setUser] = useState<LanyardUser | null>(null)
    const [elapsed, setElapsed] = useState('')
    const [loading, setLoading] = useState(true)

    // Fetch initial data via REST
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(LANYARD_REST_URL)
                const json = await res.json()
                if (json.success) {
                    setUser(json.data)
                }
            } catch (err) {
                console.error('Failed to fetch Discord status:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    // WebSocket for real-time updates
    useEffect(() => {
        let ws: WebSocket | null = null
        let heartbeatInterval: ReturnType<typeof setInterval> | null = null
        let reconnectTimeout: ReturnType<typeof setTimeout> | null = null

        const connect = () => {
            try {
                ws = new WebSocket(LANYARD_WS_URL)

                ws.onopen = () => {
                    console.log('[Discord] WebSocket connected')
                }

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data)

                        // op 1 = Hello - send subscribe and start heartbeat
                        if (data.op === 1) {
                            ws?.send(JSON.stringify({
                                op: 2,
                                d: { subscribe_to_id: DISCORD_USER_ID }
                            }))

                            // Clear any existing heartbeat
                            if (heartbeatInterval) clearInterval(heartbeatInterval)

                            heartbeatInterval = setInterval(() => {
                                if (ws?.readyState === WebSocket.OPEN) {
                                    ws.send(JSON.stringify({ op: 3 }))
                                }
                            }, data.d.heartbeat_interval)
                        }

                        // op 0 = Event (INIT_STATE or PRESENCE_UPDATE)
                        if (data.op === 0 && data.d) {
                            console.log('[Discord] Presence update received:', data.t)
                            setUser(data.d)
                        }
                    } catch (parseErr) {
                        console.error('[Discord] Failed to parse message:', parseErr)
                    }
                }

                ws.onerror = (err) => {
                    console.error('[Discord] WebSocket error:', err)
                }

                ws.onclose = (event) => {
                    console.log('[Discord] WebSocket closed:', event.code)
                    if (heartbeatInterval) {
                        clearInterval(heartbeatInterval)
                        heartbeatInterval = null
                    }
                    // Reconnect after 5s
                    reconnectTimeout = setTimeout(connect, 5000)
                }
            } catch (err) {
                console.error('[Discord] Failed to create WebSocket:', err)
                reconnectTimeout = setTimeout(connect, 5000)
            }
        }

        connect()

        return () => {
            if (heartbeatInterval) clearInterval(heartbeatInterval)
            if (reconnectTimeout) clearTimeout(reconnectTimeout)
            if (ws) {
                ws.onclose = null // Prevent reconnect on intentional close
                ws.close()
            }
        }
    }, [])

    // Find activity to display - prioritize game (type 0), then custom status (type 4)
    const displayActivity = useMemo(() => {
        if (!user?.activities) return null

        // First try to find a game activity with assets
        const gameActivity = user.activities.find(a => a.type === 0 && a.assets)
        if (gameActivity) return gameActivity

        // Then try any game activity
        const anyGame = user.activities.find(a => a.type === 0)
        if (anyGame) return anyGame

        // Then custom status (type 4)
        const customStatus = user.activities.find(a => a.type === 4)
        if (customStatus) {
            return {
                type: 4,
                name: 'Custom Status',
                state: customStatus.state,
                details: undefined,
                assets: undefined,
                application_id: undefined,
                timestamps: undefined,
            }
        }

        return null
    }, [user?.activities])

    // Separate game activity for elapsed time tracking
    const gameActivity = useMemo(() =>
        user?.activities?.find(a => a.type === 0 && a.assets) || null,
        [user?.activities]
    )

    const updateElapsedTime = useCallback(() => {
        if (gameActivity?.timestamps?.start) {
            setElapsed(getElapsedTime(gameActivity.timestamps.start))
        }
    }, [gameActivity?.timestamps?.start])

    useEffect(() => {
        if (!gameActivity?.timestamps?.start) {
            setElapsed('')
            return
        }

        updateElapsedTime()
        const intervalId = setInterval(updateElapsedTime, 1000)
        return () => clearInterval(intervalId)
    }, [gameActivity?.timestamps?.start, updateElapsedTime])

    if (loading) {
        return <LoadingSkeleton />
    }

    if (!user) {
        return <LoadingSkeleton />
    }

    const { discord_user, discord_status } = user
    const avatarUrl = getAvatarUrl(discord_user.id, discord_user.avatar)

    return (
        <DiscordLayout
            avatarUrl={avatarUrl}
            status={discord_status}
            activityContent={<ActivityDisplay activity={displayActivity} elapsed={elapsed} />}
        />
    )
}

export default memo(DiscordCard)
