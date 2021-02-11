import React, { ReactEventHandler } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import {Dialog as MDialog, DialogContent as MDialogContent, DialogContentText as MDialogContentText, DialogActions, Box, Typography, DialogTitle as MDialogTitle} from '@material-ui/core'
import { Button } from '../button'
import { noop } from '../declare'
import { CustomizeTheme, themeConfig } from '../theme'
import { DialogFramePaper } from './frame'
import { DialogButtons } from './base'

export interface PromptDialogProps {
  title: string,
  contentText?: string,
  visible: boolean,
  confirmText?: string,
  cancelText?: string,
  onConfirm?: ReactEventHandler<any>,
  onClose?: ReactEventHandler<any>,
  id?: number
}

const useStyles = makeStyles((theme: Theme) => {
  const styles = createStyles({
    backDrop: {
      // '&:first-child': {
      //   background: 'inherit',
      // },
      background: 'transparent',
    },

    promptPaper: {
      fontFamily: theme.typography.fontFamily,
      width: '167.5px',
      height: '102.5px',
      ...themeConfig.dialog.border
    },
    dialogContent: {
      background: '#ffffff',
      fontFamily: theme.typography.fontFamily,
      position: 'relative',
      padding: '0px',
      '&:first-child': {
        padding: '0px'
      }
    },
    dialogButtonGroup: {
      fontFamily: theme.typography.fontFamily,
      display: 'flex',
      justifyContent: 'center'
    },
    dialogTextTypography: {
      fontFamily: theme.typography.fontFamily,
      color: '#002591',
      textAlign: 'center',
      fontSize: '8px',
      marginTop: '6px',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '36px',
    },
  })
  return styles
})

const BasePromptDialog: React.FC<PromptDialogProps> = (props) => {
  const classes = useStyles()

  const onConfirm = props.onConfirm ? props.onConfirm : noop

  const onClose = props.onClose ? props.onClose: noop

  return (
    <MDialog
      BackdropProps={{
        classes: {
          root: classes.backDrop
        }
      }}
      PaperComponent={(paperProps: any) => {
        return <DialogFramePaper {...paperProps} closeable={true} onClose={onClose} showHeader={true} title={props.title} />
      }}
      PaperProps={{
        style: {
          width: '202px',
          height: '130px',
        },
      }}
      // classes={{paper: classes.promptPaper}}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      open={props.visible}
      onClose={onClose}
    >
      <MDialogContent
        classes={{root: classes.dialogContent}}
      >
        {props.contentText ?
          <MDialogContentText classes={{root: classes.dialogTextTypography}}>
            {props.contentText}
          </MDialogContentText>
        : null}
        <DialogButtons classes={{root: classes.dialogButtonGroup}}>
          {props.confirmText ? <Button color="primary" onClick={onConfirm} text={props.confirmText}></Button> : null}
        </DialogButtons>
      </MDialogContent>
    </MDialog>
  )
}

export const PromptDialog = (props: PromptDialogProps) => (
  <CustomizeTheme>
    <BasePromptDialog {...props} />
  </CustomizeTheme>
)