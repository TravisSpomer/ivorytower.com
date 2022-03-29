import AnimateValue from "./AnimateValue.svelte"
import Badge from "./Badge.svelte"
import Button from "./Button.svelte"
import DateTime from "./DateTime.svelte"
import Divider from "./Divider.svelte"
import Editor from "./Editor.svelte"
import FocusWithin from "./FocusWithin.svelte"
import Footer from "./Footer.svelte"
import ForumView from "./ForumView.svelte"
import HoverLink from "./HoverLink.svelte"
import LightDismiss from "./LightDismiss.svelte"
import Logo from "./Logo.svelte"
import NavBar from "./NavBar.svelte"
import Popup from "./Popup.svelte"
import PostLink from "./PostLink.svelte"
import PostView from "./PostView.svelte"
import SearchBox from "./SearchBox.svelte"
import ThreadView from "./ThreadView.svelte"
import Toolbar from "./Toolbar.svelte"
import UnreadThreadsPager from "./UnreadThreadPager.svelte"
import Upload from "./Upload.svelte"
import User from "./User.svelte"
import UserHtml from "./UserHtml.svelte"
import Wait from "./Wait.svelte"
import WhenAt from "./WhenAt.svelte"
import Year from "./Year.svelte"
import { registerSpecialLinkType } from "./upgradeLink"

export
{
	AnimateValue,
	Badge,
	Button,
	DateTime,
	Divider,
	Editor,
	FocusWithin,
	Footer,
	ForumView,
	HoverLink,
	LightDismiss,
	Logo,
	NavBar,
	Popup,
	PostView,
	SearchBox,
	ThreadView,
	Toolbar,
	UnreadThreadsPager,
	Upload,
	User,
	UserHtml,
	Wait,
	WhenAt,
	Year,
}

registerSpecialLinkType("PostLink", PostLink)
