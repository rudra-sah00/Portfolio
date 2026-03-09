/**
 * Centralized asset URLs module.
 * All image and media URLs are managed here — hosted on CDN (Cloudinary).
 * Update URLs in one place when assets change.
 */

const CDN_BASE = "https://res.cloudinary.com/dceixc4qg/image/upload/f_auto,q_auto,w_1600,c_limit";
const CDN_VIDEO = "https://res.cloudinary.com/dceixc4qg/video/upload";

// ─── Avatar ──────────────────────────────────────────────
export const AVATAR_URL = `${CDN_BASE}/v1773041752/avatar_nilljf.png`;
// ─── Streaming Project ──────────────────────────────────
export const STREAMING = {
  hero: `${CDN_BASE}/v1773039329/project-hero_xw23p2.png`,
  continueWatching: `${CDN_BASE}/v1773039327/project-content_t2nssm.png`,
  livestream: `${CDN_BASE}/v1773039327/project-content1_khxf9j.png`,
  watchlist: `${CDN_BASE}/v1773039328/project-content2_gpxhzj.png`,
  profile: `${CDN_BASE}/v1773039327/project-content3_suh68q.png`,
  servers: `${CDN_BASE}/v1773039327/project-content4_cfzrqr.png`,
  watchParty: `${CDN_BASE}/v1773039328/project-content5_pmnwi5.png`,
  watchPartyVideo: `${CDN_VIDEO}/v1773045845/watch-party_djeclu.mp4`,
} as const;

// ─── Infrastructure (Private Cloud Suite) ───────────────
export const INFRA = {
  cloud: {
    hero: `${CDN_BASE}/v1773040966/dashboard_jydrcm.png`,
    dashboard: `${CDN_BASE}/v1773040966/dashboard_jydrcm.png`,
    folders: `${CDN_BASE}/v1773040964/folders_pygb4d.png`,
    photos: `${CDN_BASE}/v1773040966/photos_bc5knv.png`,
    notes: `${CDN_BASE}/v1773040966/notes_psf7bm.png`,
    tasks: `${CDN_BASE}/v1773040966/tasks_hq2feq.png`,
    calendar: `${CDN_BASE}/v1773040964/calendar_xqdt3c.png`,
    contacts: `${CDN_BASE}/v1773040964/contacts_sxulgq.png`,
    meeting: `${CDN_BASE}/v1773040966/meeting_rmre8u.png`,
    deck: `${CDN_BASE}/v1773040964/deck_d7jygi.png`,
    activity: `${CDN_BASE}/v1773040964/activity_lbdbzs.png`,
  },
} as const;

// ─── Cosmic Watch Project ──────────────────────────────
export const COSMIC_WATCH = {
  hero: `${CDN_BASE}/v1773043547/project-hero_m7ljvo.png`,
  dashboard: `${CDN_BASE}/v1773043521/dashboard_gif5vz.png`,
  neoFeed1: `${CDN_BASE}/v1773043522/neo-feed1_sjvm4l.png`,
  neoFeed2: `${CDN_BASE}/v1773043523/neo-feed2_w6rhae.png`,
  riskAnalysis1: `${CDN_BASE}/v1773043532/risk-analysis1_v45acn.png`,
  riskAnalysis2: `${CDN_BASE}/v1773043530/risk-analysis2_hwvznz.png`,
  cneosMonitor1: `${CDN_BASE}/v1773043509/cneos-monitor1_ihdcta.png`,
  cneosMonitor2: `${CDN_BASE}/v1773043509/cneos-monitor2_qvbg3i.png`,
  cneosMonitor3: `${CDN_BASE}/v1773043508/cneos-monitor3_jbwcxv.png`,
  cneosMonitor4: `${CDN_BASE}/v1773043516/cneos-monitor4_iivrxd.png`,
  spaceWeather1: `${CDN_BASE}/v1773043548/space-weather1_l4a73g.png`,
  spaceWeather2: `${CDN_BASE}/v1773043530/space-weather2_hwqepm.png`,
  spaceWeather3: `${CDN_BASE}/v1773043545/space-weather3_ik773k.png`,
  spaceWeather4: `${CDN_BASE}/v1773043538/space-weather4_drdda2.png`,
  apod: `${CDN_BASE}/v1773043542/apod_fj3jex.png`,
  watchlist: `${CDN_BASE}/v1773043540/watchlist_fecjzl.png`,
  liveChat: `${CDN_BASE}/v1773043521/live-chat_dt04uo.png`,
  alerts: `${CDN_BASE}/v1773043506/alerts_cpp71x.png`,
  explorer3d: `${CDN_VIDEO}/v1773043510/3d-explorer_zwr6hx.mp4`,
} as const;
