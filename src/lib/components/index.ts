import AnimateValue from "./AnimateValue.svelte"
import DateTime from "./DateTime.svelte"
import Divider from "./Divider.svelte"
import Editor from "./Editor.svelte"
import Footer from "./Footer.svelte"
import ForumView from "./ForumView.svelte"
import HoverLink from "./HoverLink.svelte"
import LightDismiss from "./LightDismiss.svelte"
import NavBar from "./NavBar.svelte"
import Popup from "./Popup.svelte"
import PostLink from "./PostLink.svelte"
import PostView from "./PostView.svelte"
import ThreadView from "./ThreadView.svelte"
import UnreadThreadsPager from "./UnreadThreadPager.svelte"
import User from "./User.svelte"
import UserHtml from "./UserHtml.svelte"
import Wait from "./Wait.svelte"
import WhenAt from "./WhenAt.svelte"
import Year from "./Year.svelte"
import { registerSpecialLinkType } from "./upgradeLink"

export
{
	AnimateValue,
	DateTime,
	Divider,
	Editor,
	Footer,
	ForumView,
	HoverLink,
	LightDismiss,
	NavBar,
	Popup,
	PostView,
	ThreadView,
	UnreadThreadsPager,
	User,
	UserHtml,
	Wait,
	WhenAt,
	Year,
}

registerSpecialLinkType("PostLink", PostLink)
