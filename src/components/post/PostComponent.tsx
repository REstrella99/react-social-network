// - Import react components
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import SvgComment from '@material-ui/icons/Comment';
import SvgFavorite from '@material-ui/icons/Favorite';
import SvgFavoriteBorder from '@material-ui/icons/FavoriteBorder';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SvgPlay from '@material-ui/icons/PlayCircleFilled';
import SvgShare from '@material-ui/icons/Share';
import classNames from 'classnames';
import CommentGroup from 'components/commentGroup';
import Img from 'components/img';
import PostWrite from 'components/postWrite';
import ReadMoreComponent from 'components/readMore';
import ShareDialog from 'components/shareDialog';
import UserAvatar from 'components/userAvatar';
import copy from 'copy-to-clipboard';
import { UserPermissionType } from 'core/domain/common/userPermissionType';
import { Post } from 'core/domain/posts';
import { PostType } from 'core/domain/posts/postType';
import PostAlbumComponent from 'layouts/postAlbum';
import moment from 'moment/moment';
import * as R from 'ramda';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Linkify from 'react-linkify';
import ReactPlayer from 'react-player';
import { NavLink } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import config from 'src/config';

import { connectPost } from './connectPost';
import { IPostComponentProps } from './IPostComponentProps';
import { IPostComponentState } from './IPostComponentState';
import { postStyles } from './postStyles';

// - Material UI
// - Import app components
// - Import actions
// - Create component class
export class PostComponent extends Component<IPostComponentProps, IPostComponentState> {

  styles = {
    dialog: {
      width: '',
      maxWidth: '530px',
      borderRadius: '4px'
    }

  }

  /**
   * Component constructor
   *
   */
  constructor(props: IPostComponentProps) {
    super(props)
    const { post } = props
    this.state = {
      /**
       * Post text
       */
      text: post.get('body', ''),
      /**
       * It's true if whole the text post is visible
       */
      readMoreState: false,
      /**
       * Handle open comment from parent component
       */
      openComments: false,
      /**
       * If it's true, share dialog will be open
       */
      shareOpen: false,
      /**
       * If it's true comment will be disabled on post
       */
      disableComments: post.get('disableComments'),
      /**
       * If it's true share will be disabled on post
       */
      disableSharing: post.get('disableSharing'),
      /**
       * Title of share post
       */
      shareTitle: 'Share On',
      /**
       * If it's true, post link will be visible in share post dialog
       */
      openCopyLink: false,
      /**
       * If it's true, post write will be open
       */
      openPostWrite: false,
      /**
       * Post menu anchor element
       */
      postMenuAnchorEl: null,
      /**
       * Whether post menu open
       */
      isPostMenuOpen: false,
      /**
       * Whether video display
       */
      showVideo: false
    }

    // Binding functions to this
    this.handleReadMore = this.handleReadMore.bind(this)
    this.getOpenCommentGroup = this.getOpenCommentGroup.bind(this)
    this.handleVote = this.handleVote.bind(this)
    this.handleOpenShare = this.handleOpenShare.bind(this)
    this.handleCloseShare = this.handleCloseShare.bind(this)
    this.handleCopyLink = this.handleCopyLink.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleOpenPostWrite = this.handleOpenPostWrite.bind(this)
    this.handleClosePostWrite = this.handleClosePostWrite.bind(this)
    this.handleOpenComments = this.handleOpenComments.bind(this)
    this.rightIconMenu = this.rightIconMenu.bind(this)
  }

  /**
   * Toggle on show/hide comment
   */
  handleOpenComments = () => {
    const { getPostComments, post } = this.props
    const id = post.get('id')
    const ownerUserId = post.get('ownerUserId')
      getPostComments!(ownerUserId!, id!)
    this.setState({
      openComments: !this.state.openComments
    })
  }

  /**
   * Open post write
   */
  handleOpenPostWrite = () => {
    this.closePostMenu()
    this.setState({
      openPostWrite: true
    })
  }

  /**
   * Close post write
   */
  handleClosePostWrite = () => {
    this.setState({
      openPostWrite: false
    })
  }

  /**
   * Delete a post
   */
  handleDelete = () => {
    const { post } = this.props
    this.closePostMenu()
    this.props.delete!(post.get('id'))
  }

  /**
   * Open post menu
   */
  openPostMenu = (event: any) => {
    this.setState({
      postMenuAnchorEl: event.currentTarget,
      isPostMenuOpen: true
    })
  }

  /**
   * Close post menu
   */
  closePostMenu = () => {
    this.setState({
      postMenuAnchorEl: null,
      isPostMenuOpen: false
    })
  }

  /**
   * Show copy link
   */
  handleCopyLink = () => {
    const { t } = this.props
    this.setState({
      openCopyLink: true,
      shareTitle: t!('post.copyLinkButton')
    })
  }

  /**
   * Open share post
   */
  handleOpenShare = () => {
    const { post } = this.props
    copy(`${window.location.origin}/${post.get('ownerUserId')}/posts/${post.get('id')}`)
    this.setState({
      shareOpen: true
    })
  }

  /**
   * Close share post
   */
  handleCloseShare = () => {
    this.setState({
      shareOpen: false,
      shareTitle: 'Share On',
      openCopyLink: false
    })
  }

  /**
   * Handle vote on a post
   */
  handleVote = () => {

    if (this.props.currentUserVote) {
      this.props.unvote!()
    } else {
      this.props.vote!()
    }
  }

  /**
   * Set open comment group function on state which passed by CommentGroup component
   */
  getOpenCommentGroup = (open: () => void) => {
    this.setState({
      openCommentGroup: open
    })
  }

  /**
   * Handle read more event
   */
  handleReadMore(event: any) {
    this.setState({
      readMoreState: !this.state.readMoreState

    })
  }

  /**
   * Handle on displaying video
   */
  onShowVideo = () => {
    this.setState({
      showVideo: true
    })
  }

  /**
   * Get permission label
   */
  getPermissionLabel = () => {
    const { t, post } = this.props
    const permission = post.get('permission')
    let permissionLabel = ''
    if (permission === UserPermissionType.Public) {
      permissionLabel = t!('permission.public')
    } else if (permission === UserPermissionType.Circles) {
      permissionLabel = t!('permission.circles')
    } else if (permission === UserPermissionType.OnlyMe) {
      permissionLabel = t!('permission.onlyMe')
    }
    return permissionLabel
  }

  shouldComponentUpdate(nextProps: IPostComponentProps ,nextState: IPostComponentState) {

    let shouldUpdate = false

    if (!nextProps.post.equals(this.props.post)) {
      shouldUpdate = true
    } else if ((nextProps.commentList!) !== (this.props.commentList!)) {
      shouldUpdate = true
    } else if (this.props.getPostComments !== nextProps.getPostComments) {
      shouldUpdate = true
    } else if (!R.equals(this.state, nextState)) {
      shouldUpdate = true
    }
    return shouldUpdate
  }

  /**
   * Right Image Icon
   */
rightIconMenu = () => {
  const { post, t } = this.props
  const { postMenuAnchorEl, isPostMenuOpen} = this.state
  return (
    <div>
      <IconButton
        onClick={this.openPostMenu.bind(this)}
      >
        <MoreVertIcon />
      </IconButton>

        <Menu
          open={isPostMenuOpen!}
          anchorEl={postMenuAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          onClose={this.closePostMenu}>
        {post.get('postTypeId') !== PostType.Album &&  <MenuItem onClick={this.handleOpenPostWrite} > {t!('post.edit')} </MenuItem>}
          <MenuItem onClick={this.handleDelete} > {t!('post.delete')} </MenuItem>
          <MenuItem
            onClick={() => this.props.toggleDisableComments!(!post.get('disableComments'))} >
            {post.get('disableComments') ? t!('post.enableComments') : t!('post.disableComments')}
          </MenuItem>
          <MenuItem
            onClick={() => this.props.toggleSharingComments!(!post.get('disableSharing'))} >
            {post.get('disableSharing') ? t!('post.enableSharing') : t!('post.disableSharing')}
          </MenuItem>
        </Menu>
    </div>
  )

}
  /**
   * Reneder component DOM
   */
  render() {
    const { post, setHomeTitle, goTo, isPostOwner, commentList, classes} = this.props
    const { showVideo } = this.state
    const rawPost = post.toJS() as Post
    const {
      ownerUserId,
      ownerDisplayName,
      creationDate,
      ownerAvatar,
      image,
      body,
      video,
      videoThumbnails,
      postTypeId,
      id,
      disableComments,
      commentCounter,
      disableSharing,
      album,
      score,
      version
    } = rawPost
    // Define variables
    return (
      <Card key={id + 'post-card'} className='animate-top'>
        <CardHeader
          title={<NavLink to={`/${ownerUserId}`}>{ownerDisplayName}</NavLink>}
          subheader={creationDate ? (version === config.dataFormat.postVersion
             ? moment(creationDate).local().fromNow()
             : moment(creationDate!).local().fromNow()) + ` | ${this.getPermissionLabel()}` : <LinearProgress color='primary' />}
          avatar={<NavLink to={`/${ownerUserId}`}><UserAvatar fullName={ownerDisplayName!} fileName={ownerAvatar!} size={36} /></NavLink>}
          action={isPostOwner ? this.rightIconMenu() : ''}
        >
        </CardHeader>
        {((image && image !== '' && postTypeId === PostType.Photo)
          || (videoThumbnails && videoThumbnails !== '' && video && video !== '' && postTypeId === PostType.Video)) ? (
            <CardMedia
              className={classes.cardMedia}
              image={postTypeId === PostType.Photo ? image! : videoThumbnails!}>
              {showVideo
                ? <div className='player-wrapper'>
                  <ReactPlayer
                    controls={true}
                    className='react-player'
                    width='100%'
                    height='100%'
                    url={video} playing
                  />
                </div>
                : (
                  <>
                    <Img fileName={postTypeId === PostType.Photo ? image! : videoThumbnails!} />
                    <span className={classNames(classes.playVideo, { [classes.noDisplay]: postTypeId !== PostType.Video })}>
                      <IconButton className={classes.playIconButtonRoot} onClick={this.onShowVideo}>
                        <SvgPlay className={classes.playIcon} />
                      </IconButton>
                    </span>
                  </>
                )
              }
            </CardMedia>) : ''}
            {
              (album && album.photos  && (postTypeId === PostType.Album || postTypeId === PostType.PhotoGallery))
              ? <PostAlbumComponent key={`post-album-grid-${id}`}
                currentAlbum={rawPost}
              images={[...album.photos].map((photo) => ({src: photo.url, url: photo.url, id: photo.fileId }))} />
              : ''
            }

        <CardContent className={classes.postBody}>
        <ReadMoreComponent body={body!} >
          <Linkify properties={{ target: '_blank', style: { color: 'blue' }, onClick: (event:  React.MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}}>
            {reactStringReplace(body, /#(\w+)/g, (match: string, i: number) => (
              <NavLink
                style={{ color: 'green' }}
                key={match + i}
                to={`/tag/${match}`}
                onClick={evt => {
                  evt.preventDefault()
                  evt.stopPropagation()
                  goTo!(`/tag/${match}`)
                  setHomeTitle!(`#${match}`)
                }}
              >
                #{match}

              </NavLink>

            ))}
          </Linkify>
        </ReadMoreComponent>
        </CardContent>

        <CardActions>
          <div className={classes.vote}>
            <IconButton
              className={classes.iconButton}
              onClick={this.handleVote}
              aria-label='Love'>
              <Checkbox
                className={classes.iconButton}
                checkedIcon={<SvgFavorite style={{ fill: '#4CAF50' }} />}
                icon={<SvgFavoriteBorder style={{ fill: '#757575' }} />}
                checked={this.props.currentUserVote}
              />
            </IconButton>
              <div className={classes.voteCounter}> {score! > 0 ? score : ''} </div>
          </div>

          <div style={{ display: 'inherit' }}><IconButton
            className={classes.iconButton}
            onClick={this.handleOpenComments}
            aria-label='Comment'>
            <SvgComment />
          </IconButton>
            <div className={classes.commentCounter}>{commentCounter! > 0 ? commentCounter : ''} </div>
          </div>
          {!disableSharing ? (<IconButton
            className={classes.iconButton}
            onClick={this.handleOpenShare}
            aria-label='Comment'>
            <SvgShare />
          </IconButton>) : ''}

        </CardActions>

        <CommentGroup open={this.state.openComments} comments={commentList} ownerPostUserId={ownerUserId!} onToggleRequest={this.handleOpenComments} isPostOwner={this.props.isPostOwner!} disableComments={disableComments!} postId={id!} />
        <ShareDialog
          onClose={this.handleCloseShare}
          shareOpen={this.state.shareOpen}
          onCopyLink={this.handleCopyLink}
          openCopyLink={this.state.openCopyLink}
          post={post}

        />

        {this.state.openPostWrite && (
        <PostWrite
        key={`post-component-post-write-${id}`}
          open={this.state.openPostWrite}
          onRequestClose={this.handleClosePostWrite}
          edit={true}
          postModel={post}
        />)}

      </Card>

    )
  }
}

const translateWrapper = withTranslation('translations')(PostComponent as any)

export default connectPost(withStyles(postStyles as any)(translateWrapper as any) as any)
