# Vibrational structure problem

## Overview

We seek the energy eigenstates (or thermal states) of the Hamiltonian that describes the vibrations of the nuclei in a molecule around their equilibrium positions. This Hamiltonian contains the kinetic energy of the nuclei and the effective potential that they move on, which is determined by the electronic potential energy surface (i.e. the electronic energy expressed as a function of the nuclear coordinates).


## Actual end-to-end problem(s) solved

Solving the Schrodinger equation while treating electrons and nuclei on an equal footing has prohibitively high computational cost for all but the smallest systems. For systems where it is valid to separate the electronic and nuclear motions (the Born–Oppenheimer approximation), we can imagine the nuclei moving on the electronic potential energy surface (PES). For molecules composed of light atoms (where relativistic effects can be neglected) the vibrations of the nuclei around their equilibrium positions provide a first-order correction to the electronic energies, and influence photo-emission/absorption properties. For a system with $G$ classical nuclei at equilibrium positions $\{R_I\}$ the vibrational Hamiltonian can be written as $$\begin{equation} H = - \sum_I \frac{\nabla_I^2}{2 M_I} + V_e(\{ R_I \}) \end{equation}$$ where $V_e(\{ R_I \})$ denotes the nuclear potential determined by the electronic potential energy surface, obtained by first solving the [electronic structure problem](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem) for a range of nuclear positions. The vibrational structure problem can be made classically tractable by modelling $V_e$ as a harmonic potential, which reduces the problem to solving a number of coupled quantum harmonic oscillators. In order to accurately describe nonrigid molecules or highly excited vibrational states, additional anharmonic terms are required in the potential. These can be obtained by expanding the potential $V_e$ to degree $d$. Obtaining accurate solutions of this Hamiltonian is prohibitively costly for many systems of interest. We seek to prepare eigenstates (or thermal states) of this anharmonic vibrational Hamiltonian, and then measure the expectation values of observables with respect to these states. Properties of interest include:


- The vibrational energy at the minimum of the PES, which provides a first-order correction to the electronic energies (for calculating excitation energies, determining stable molecular structures, or finding reaction pathways and rates).
- Determining transition probabilities between states, and transition dipole moments (for calculating infrared/Raman spectra between vibrational levels of the same electronic state, or vibronic spectra between vibrational levels of different electronic states).


[Thermal states](../../quantum-algorithmic-primitives/gibbs-sampling.md#gibbs-sampling) are often of greater interest in the vibrational case than in the electronic case: the differences between vibrational energy levels are smaller than the differences between electronic energy levels, and as a result, excited vibrational states are populated even at room temperature. This can be contrasted with the [electronic structure problem](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem), where the larger electronic energy gaps of many molecules mean that ground states are typically of primary interest at room temperature.


## Dominant resource cost/complexity

A molecule with $G$ atoms has $M= 3G - 6$ ($M=3G-5$ for linear molecules) vibrational modes. Each vibrational mode is treated as distinguishable and is considered to be in one of $N$ vibrational energy levels of the harmonic oscillator Hamiltonian (one can also work in different basis sets). We thus require $M\log(N)$ qubits to represent the problem, where the energy level of each vibrational mode is encoded in binary (or an equivalent representation, such as the Gray code [@sawaya2020ResourceEfficientQuantumDLevel]).


Preparing the desired eigenstate or thermal state can be achieved using the methods introduced for the [electronic structure problem](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem), although the costs of most of these methods have not yet been determined for the vibrational problem. For example, energy eigenstates can be prepared using [quantum phase estimation (QPE)](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation), given a state with sufficient overlap with the target state. Methods for preparing eigenstates depend polynomially on either the overlap between an initial state and the desired eigenstate (e.g. QPE or [quantum singular-value transformation (QSVT)](../../quantum-algorithmic-primitives/quantum-linear-algebra/quantum-singular-value-transformation.md#quantum-singular-value-transformation)-based eigenstate filtering [@lin2020NearOptimalGroundState]), or on the minimum energy gap along an [adiabatic](../../quantum-algorithmic-primitives/quantum-adiabatic-algorithm.md#quantum-adiabatic-algorithm) path from the initial to desired state (e.g., [@wan2020FastDigitalMethodsForAdiabatic]). The complexities of subroutines to prepare eigenstates and extract observables are determined by the following observations:


1. All methods scale as $\Omega(1/\epsilon)$ to measure the desired observable to an error of $\pm \epsilon$. For the energy, we typically seek $\epsilon \sim (1 - 10)$ cm$^{-1}$ $\approx (4.56 \times 10^{-6}) - (4.56 \times 10^{-5})~\mathrm{Hartree}$ (due to the close historical ties with spectroscopy, in vibrational chemistry it is common to see energies expressed as wavenumbers. Interconversion can be performed using the Planck relation). For comparison, the largest matrix elements in the vibrational Hamiltonian (the harmonic couplings) are typically on the order of 1000 cm$^{-1}$, and there are $\mathcal{O}\left( M \right)$ such terms [@sawaya2021NearLongTermQuantumVibrationalSpectroscopy]. As such, the ratio $\nrm{H}_1 / \epsilon$ that features multiplicatively in the complexity of [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) (at least, variants based on [qubitization](../../quantum-algorithmic-primitives/quantum-linear-algebra/qubitization.md#qubitization)) can be on the order of $10^4$ (or larger) for modest system sizes with $M \approx 100$.
2. To date, only [product-formula](../../quantum-algorithmic-primitives/hamiltonian-simulation/product-formulae.md#product-formulae)-based methods have been considered for providing coherent access to the vibrational Hamiltonian. These methods scale with the number of Pauli terms in the Hamiltonian, which grows as $\mathcal{O}\left( M^d N^{2d} \right)$ for a degree $d$ of anharmonic terms considered in the Hamiltonian (often at least 4th order).


## Existing error corrected resource estimates

To date, there have been no error corrected resource estimates for the vibrational structure problem. In terms of initial steps in this direction, [@sawaya2020ResourceEfficientQuantumDLevel] considered the resources required to map vibrational operators to qubit operators, while [@sawaya2021NearLongTermQuantumVibrationalSpectroscopy] compared the number of terms (and their magnitudes) in vibrational Hamiltonians to those in [electronic structure Hamiltonians](../../areas-of-application/quantum-chemistry/electronic-structure-problem.md#electronic-structure-problem).


## Caveats

Both classical and quantum algorithms for the vibrational structure problem require the availability of a high-accuracy electronic PES, from classical calculations. For a grid-based interpolation of the multidimensional PES with $h$ points per dimension, we require $\mathcal{O}\left( h^M \right)$ PES evaluations. Nevertheless, a number of interpolation techniques and adaptive methods have been developed to obtain high-accuracy PESs, at lower costs. Moreover, a number of molecules with classically challenging vibrational spectra have been identified with classically easy electronic structures [@sawaya2021NearLongTermQuantumVibrationalSpectroscopy].


There has been less work on the number of vibrational basis states required to achieve a given accuracy than in the electronic case. While rigorous results exist for more simple bosonic Hamiltonians [@tong2021ProvablyAccurateGaugeTheoryBosonicSystems], the truncation level $N$ has not yet been established for anharmonic potentials.


When calculating overlaps between the vibrational states belonging to different electronic energy levels (vibronic transitions), the Hamiltonians are expressed in different coordinates, and so one must either transform the state or the Hamiltonian using the Duschinsky transformation (see, e.g., [@Huh2015VibrationBosonSampling; @mcardle2019VibrationalSim] for a discussion of this issue).


## Comparable classical complexity and challenging instance sizes

A hierarchy of classical methods has been developed for the vibrational structure problem, which trade increased accuracy for increased cost. Vibrational states with a multireference nature (which are required to describe vibrational resonances that arise due to near-degeneracies between different vibrational eigenstates, resulting from anharmonicities in the PES) require more accurate (and thus costly) methods. Moreover, nonrigid molecules require a higher degree approximation of the PES, leading to an increased cost for classical methods (and potentially increasing the complexity of the resulting eigenstates). For such challenging systems, accurate classical results have been obtained for molecules with $G=20$–$30$ atoms [@carrington2017PerspectiveVibrationalSpectra; @baiardi2017VibrationalDMRG; @thomas2018UsingIterativeEigensolverVibrationalSpectra; @Barone2021ComputationalMolecularSpectroscopy].


## Speedup

In order to achieve superpolynomial speedup over classical methods for preparing a given eigenstate we require:


- Polynomially scaling classical methods to grow their approximation parameter exponentially as the system size increases.
- The ability to prepare an initial state with nonexponentially vanishing overlap with the desired state, in polynomial time.


There exist spectroscopy calculations in which the initial state is easy to prepare for both quantum and classical computers, but certain excited states may be difficult to prepare, due to their small overlap with this initial state. However, in such calculations this can be exploited as a feature, rather than a bug. For example in [@sawaya2019QuantumAlgorithmMolecularSpectra] it was proposed to use [quantum phase estimation](../../quantum-algorithmic-primitives/quantum-phase-estimation.md#quantum-phase-estimation) to project from the initial state into other eigenstates with probability given by the squared overlap between the states. This corresponds to the transition probability measured in the desired spectrum. We note that whereas a single (exponentially costly) classical diagonalization of the vibrational Hamiltonian would provide complete access to the entire vibrational absorption/emission spectrum, a large number of repetitions of the quantum algorithm would be required to reconstruct the spectrum. Even if quantum algorithms do not provide an exponential speedup, they may still provide polynomial speedups over exact (and approximate) classical methods.


## NISQ implementations

There have been proposals to apply [variational algorithms](../../quantum-algorithmic-primitives/variational-quantum-algorithms.md#variational-quantum-algorithms) to solve the vibrational structure problem [@mcardle2019VibrationalSim; @ollitrault2020VibrationalVQE; @sawaya2020ResourceEfficientQuantumDLevel; @sawaya2021NearLongTermQuantumVibrationalSpectroscopy], but it seems unlikely that sufficiently deep circuits can be implemented to surpass classical methods. There have also been a number of analog quantum simulations that map the vibrational structure problem onto bosonic modes such as photons [@sparrow2018VibrationAnalogPhotons; @Huh2015VibrationBosonSampling; @wang2020AnalogVibrationSuperconducting]. Nevertheless, it appears challenging to scale these simulations to sufficiently large system sizes, due to the decoherence present in the simulation platforms.


## Outlook

Further work is required to identify target systems that are challenging to simulate classically, but that may be amenable to quantum algorithms. In addition, existing quantum algorithms need to be further optimized for the accuracy required in vibrational structure problems and the form of the vibrational Hamiltonian. This will enable resource estimates for end-to-end applications, such as estimating vibrational spectra. 


