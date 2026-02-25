/**
 * TransitionScreen — Shared transition component for all Fast Track tools.
 * Renders the between-step screen: step counter, headline, subtitle,
 * BRUTAL TRUTH card, PEER PROOF card, and CONTINUE button.
 *
 * Usage in each tool's Babel block:
 *   {renderTransitionScreen(step, CONFIG, totalSteps, setStep)}
 *
 * Each tool's CONFIG must include:
 *   CLOSING_MESSAGES: { [stepNum]: { title: string, text: string } }
 *   TRANSITION_CONTENT: { [stepNum]: { brutalTruth: string, peerProof: string } }
 *
 * Trigger: half-step values (1.5, 2.5, 3.5, 4.5, 5.5, 6.5, ...)
 */
(function () {
    'use strict';

    var R = window.React;

    function renderTransitionScreen(step, config, totalSteps, setStepFn) {
        if (!R) return null;

        // Only render on half-step values
        var halfSteps = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5];
        if (halfSteps.indexOf(step) === -1) return null;

        var completedStep = Math.floor(step);
        var nextStep = completedStep + 1;

        var transContent = config && config.TRANSITION_CONTENT && config.TRANSITION_CONTENT[completedStep];
        var closingMsg = config && config.CLOSING_MESSAGES && config.CLOSING_MESSAGES[completedStep];

        // If no content defined for this step, skip silently
        if (!transContent && !closingMsg) return null;

        var brutalTruth = transContent && transContent.brutalTruth;
        var peerProof = transContent && transContent.peerProof;
        var title = (closingMsg && closingMsg.title) || ('STEP ' + completedStep + ' COMPLETE');
        var subtitle = (closingMsg && closingMsg.text) || '';
        var isLastStep = completedStep >= totalSteps;
        var buttonLabel = isLastStep ? 'SEE YOUR CANVAS' : ('CONTINUE TO STEP ' + nextStep);

        return R.createElement('div', {
            style: {
                minHeight: '100vh',
                background: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 32px'
            }
        },
            R.createElement('div', {
                style: {
                    maxWidth: 640,
                    width: '100%',
                    textAlign: 'center',
                    color: '#fff',
                    animation: 'fadeSlideIn 0.4s ease'
                }
            },
                // Step counter
                R.createElement('div', {
                    style: {
                        fontFamily: "'Monument', monospace",
                        fontSize: 12,
                        color: '#FFF469',
                        letterSpacing: '0.1em',
                        marginBottom: 16,
                        textTransform: 'uppercase'
                    }
                }, 'STEP ' + completedStep + ' OF ' + totalSteps),

                // Headline
                R.createElement('h1', {
                    style: {
                        fontFamily: "'Plaak', sans-serif",
                        fontSize: 48,
                        fontWeight: 700,
                        marginBottom: 12,
                        textTransform: 'uppercase',
                        lineHeight: 1.1,
                        color: '#fff'
                    }
                }, title),

                // Subtitle
                subtitle ? R.createElement('p', {
                    style: {
                        fontSize: 16,
                        color: '#ccc',
                        marginBottom: 48,
                        lineHeight: 1.6
                    }
                }, subtitle) : null,

                // BRUTAL TRUTH card
                brutalTruth ? R.createElement('div', {
                    style: {
                        background: '#111',
                        border: '1px solid #333',
                        borderLeft: '4px solid #FFF469',
                        padding: '20px 24px',
                        marginBottom: 24,
                        textAlign: 'left'
                    }
                },
                    R.createElement('span', {
                        style: {
                            fontFamily: "'Monument', monospace",
                            fontSize: 10,
                            color: '#FFF469',
                            display: 'block',
                            marginBottom: 8,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase'
                        }
                    }, 'BRUTAL TRUTH'),
                    R.createElement('p', {
                        style: {
                            fontSize: 14,
                            color: '#ccc',
                            lineHeight: 1.7,
                            margin: 0
                        }
                    }, brutalTruth)
                ) : null,

                // PEER PROOF card
                peerProof ? R.createElement('div', {
                    style: {
                        background: '#111',
                        border: '1px solid #333',
                        borderLeft: '4px solid #666',
                        padding: '20px 24px',
                        marginBottom: 48,
                        textAlign: 'left'
                    }
                },
                    R.createElement('span', {
                        style: {
                            fontFamily: "'Monument', monospace",
                            fontSize: 10,
                            color: '#999',
                            display: 'block',
                            marginBottom: 8,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase'
                        }
                    }, 'PEER PROOF'),
                    R.createElement('p', {
                        style: {
                            fontSize: 14,
                            color: '#ccc',
                            lineHeight: 1.7,
                            fontStyle: 'italic',
                            margin: 0
                        }
                    }, peerProof)
                ) : null,

                // Continue button
                R.createElement(TransitionButton, {
                    label: buttonLabel,
                    onClick: function () {
                        setStepFn(isLastStep ? 999 : nextStep);
                    }
                })
            )
        );
    }

    // Button with hover state using React class component
    function TransitionButton(props) {
        var state = R.useState('#fff');
        var bg = state[0];
        var setBg = state[1];

        return R.createElement('button', {
            onClick: props.onClick,
            onMouseOver: function () { setBg('#FFF469'); },
            onMouseOut: function () { setBg('#fff'); },
            style: {
                background: bg,
                color: '#000',
                border: 'none',
                padding: '16px 48px',
                fontSize: 16,
                fontFamily: "'Monument', monospace",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
            }
        }, props.label);
    }

    window.renderTransitionScreen = renderTransitionScreen;
})();
